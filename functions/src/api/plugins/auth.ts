import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Type } from '@sinclair/typebox'
import * as admin from 'firebase-admin'

import { UserProfile, AuthToken } from '../schemas'

export interface AuthConfig {
    jwtSecret: string
    jwtExpiresIn: string
    apiKeySecret: string
    refreshTokenExpiresIn: string
    passwordSaltRounds: number
}

export interface JWTPayload {
    userId: string
    email: string
    role: string
    organizationId?: string
    iat?: number
    exp?: number
}

declare module 'fastify' {
    interface FastifyRequest {
        user?: UserProfile
        jwtPayload?: JWTPayload
    }

    interface FastifyInstance {
        authenticate: (
            request: FastifyRequest,
            reply: FastifyReply
        ) => Promise<void>
        authenticateOptional: (
            request: FastifyRequest,
            reply: FastifyReply
        ) => Promise<void>
        authenticateAdmin: (
            request: FastifyRequest,
            reply: FastifyReply
        ) => Promise<void>
        authenticateApiKey: (
            request: FastifyRequest,
            reply: FastifyReply
        ) => Promise<void>
        hashPassword: (password: string) => Promise<string>
        verifyPassword: (password: string, hash: string) => Promise<boolean>
        generateTokens: (payload: Omit<JWTPayload, 'iat' | 'exp'>) => AuthToken
        verifyFirebaseToken: (
            idToken: string
        ) => Promise<admin.auth.DecodedIdToken>
    }
}

const authPlugin: FastifyPluginAsync<AuthConfig> = async (server, options) => {
    // Initialize Firebase Admin if not already initialized
    if (admin.apps.length === 0) {
        admin.initializeApp()
    }

    // Password utilities
    server.decorate(
        'hashPassword',
        async (password: string): Promise<string> => {
            return bcrypt.hash(password, options.passwordSaltRounds)
        }
    )

    server.decorate(
        'verifyPassword',
        async (password: string, hash: string): Promise<boolean> => {
            return bcrypt.compare(password, hash)
        }
    )

    // Token utilities
    server.decorate(
        'generateTokens',
        (payload: Omit<JWTPayload, 'iat' | 'exp'>): AuthToken => {
            const accessToken = jwt.sign(payload, options.jwtSecret, {
                expiresIn: options.jwtExpiresIn,
            })

            const refreshToken = jwt.sign(
                { userId: payload.userId, type: 'refresh' },
                options.jwtSecret,
                { expiresIn: options.refreshTokenExpiresIn }
            )

            // Extract expiration time from JWT
            const decoded = jwt.decode(accessToken) as any
            const expiresIn = decoded.exp - decoded.iat

            return {
                accessToken,
                refreshToken,
                expiresIn,
                tokenType: 'Bearer' as const,
            }
        }
    )

    // Firebase token verification
    server.decorate('verifyFirebaseToken', async (idToken: string) => {
        try {
            return await admin.auth().verifyIdToken(idToken)
        } catch (error) {
            server.log.error('Firebase token verification failed:', error)
            throw new Error('Invalid Firebase token')
        }
    })

    // JWT Authentication hook
    server.decorate(
        'authenticate',
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const authHeader = request.headers.authorization

                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return reply.code(401).send({
                        code: 'UNAUTHORIZED',
                        error: 'Unauthorized',
                        message: 'Missing or invalid authorization header',
                        statusCode: 401,
                    })
                }

                const token = authHeader.slice(7) // Remove 'Bearer ' prefix

                try {
                    const payload = jwt.verify(
                        token,
                        options.jwtSecret
                    ) as JWTPayload
                    request.jwtPayload = payload

                    // TODO: Fetch user profile from database/Firestore
                    // For now, create a mock user profile from JWT payload
                    request.user = {
                        id: payload.userId,
                        email: payload.email,
                        firstName: 'User', // TODO: Get from database
                        lastName: 'Name', // TODO: Get from database
                        role: payload.role as any,
                        isEmailVerified: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }
                } catch (jwtError) {
                    return reply.code(401).send({
                        code: 'INVALID_TOKEN',
                        error: 'Unauthorized',
                        message: 'Invalid or expired token',
                        statusCode: 401,
                    })
                }
            } catch (error) {
                server.log.error('Authentication error:', error)
                return reply.code(500).send({
                    code: 'INTERNAL_ERROR',
                    error: 'Internal Server Error',
                    message: 'Authentication failed',
                    statusCode: 500,
                })
            }
        }
    )

    // Optional authentication hook
    server.decorate(
        'authenticateOptional',
        async (request: FastifyRequest, reply: FastifyReply) => {
            const authHeader = request.headers.authorization

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return // No authentication provided, continue without user
            }

            try {
                await server.authenticate(request, reply)
            } catch (error) {
                // Log the error but don't fail the request
                server.log.warn('Optional authentication failed:', error)
            }
        }
    )

    // Admin role authentication
    server.decorate(
        'authenticateAdmin',
        async (request: FastifyRequest, reply: FastifyReply) => {
            await server.authenticate(request, reply)

            if (
                !request.user ||
                (request.user.role !== 'admin' &&
                    request.user.role !== 'super_admin')
            ) {
                return reply.code(403).send({
                    code: 'FORBIDDEN',
                    error: 'Forbidden',
                    message: 'Admin access required',
                    statusCode: 403,
                })
            }
        }
    )

    // API Key authentication
    server.decorate(
        'authenticateApiKey',
        async (request: FastifyRequest, reply: FastifyReply) => {
            const apiKey = request.headers['x-api-key']

            if (!apiKey || typeof apiKey !== 'string') {
                return reply.code(401).send({
                    code: 'UNAUTHORIZED',
                    error: 'Unauthorized',
                    message: 'Missing API key',
                    statusCode: 401,
                })
            }

            // TODO: Implement proper API key validation
            // For now, just check against a secret
            if (apiKey !== options.apiKeySecret) {
                return reply.code(401).send({
                    code: 'INVALID_API_KEY',
                    error: 'Unauthorized',
                    message: 'Invalid API key',
                    statusCode: 401,
                })
            }

            // Set a service user for API key requests
            request.user = {
                id: 'api-service',
                email: 'api@openfeedback.io',
                firstName: 'API',
                lastName: 'Service',
                role: 'admin',
                isEmailVerified: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        }
    )
}

export { authPlugin }
export default fp(authPlugin)
