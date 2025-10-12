import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

import {
    AuthTokenSchema,
    LoginRequestSchema,
    RegisterRequestSchema,
    RefreshTokenRequestSchema,
    ErrorSchema,
    UserProfileSchema,
} from '../schemas'

export const authRoutes: FastifyPluginAsync = async (server) => {
    // Login endpoint
    server.post(
        '/login',
        {
            schema: {
                description: 'Authenticate user with email and password',
                tags: ['Authentication'],
                body: LoginRequestSchema,
                response: {
                    200: AuthTokenSchema,
                    400: ErrorSchema,
                    401: ErrorSchema,
                    429: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { email, password } = request.body

            // TODO: Implement actual user authentication
            // For now, return a mock response
            if (
                email === 'demo@openfeedback.io' &&
                password === 'password123'
            ) {
                const tokens = server.generateTokens({
                    userId: 'demo-user-id',
                    email,
                    role: 'user',
                })

                return tokens
            }

            return reply.code(401).send({
                code: 'INVALID_CREDENTIALS',
                error: 'Unauthorized',
                message: 'Invalid email or password',
                statusCode: 401,
            })
        }
    )

    // Register endpoint
    server.post(
        '/register',
        {
            schema: {
                description: 'Register a new user account',
                tags: ['Authentication'],
                body: RegisterRequestSchema,
                response: {
                    201: Type.Object({
                        user: UserProfileSchema,
                        tokens: AuthTokenSchema,
                    }),
                    400: ErrorSchema,
                    409: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { email, password, firstName, lastName } = request.body

            // TODO: Check if user already exists
            // TODO: Hash password and store user in database

            // Mock user creation
            const userId = `user_${Date.now()}`
            const hashedPassword = await server.hashPassword(password)

            const user = {
                id: userId,
                email,
                firstName,
                lastName,
                role: 'user' as const,
                isEmailVerified: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            const tokens = server.generateTokens({
                userId,
                email,
                role: 'user',
            })

            reply.code(201).send({
                user,
                tokens,
            })
        }
    )

    // Refresh token endpoint
    server.post(
        '/refresh',
        {
            schema: {
                description: 'Refresh access token using refresh token',
                tags: ['Authentication'],
                body: RefreshTokenRequestSchema,
                response: {
                    200: AuthTokenSchema,
                    401: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { refreshToken } = request.body

            try {
                // TODO: Verify refresh token and get user data
                // For now, just return new tokens
                const tokens = server.generateTokens({
                    userId: 'demo-user-id',
                    email: 'demo@openfeedback.io',
                    role: 'user',
                })

                return tokens
            } catch (error) {
                return reply.code(401).send({
                    code: 'INVALID_REFRESH_TOKEN',
                    error: 'Unauthorized',
                    message: 'Invalid or expired refresh token',
                    statusCode: 401,
                })
            }
        }
    )

    // Firebase token login
    server.post(
        '/firebase',
        {
            schema: {
                description: 'Authenticate using Firebase ID token',
                tags: ['Authentication'],
                body: Type.Object({
                    idToken: Type.String({ description: 'Firebase ID token' }),
                }),
                response: {
                    200: Type.Object({
                        user: UserProfileSchema,
                        tokens: AuthTokenSchema,
                    }),
                    401: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { idToken } = request.body

            try {
                const decodedToken = await server.verifyFirebaseToken(idToken)

                // TODO: Get or create user in database
                const user = {
                    id: decodedToken.uid,
                    email: decodedToken.email || '',
                    firstName: decodedToken.name?.split(' ')[0] || 'User',
                    lastName:
                        decodedToken.name?.split(' ').slice(1).join(' ') ||
                        'Name',
                    role: 'user' as const,
                    isEmailVerified: decodedToken.email_verified || false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }

                const tokens = server.generateTokens({
                    userId: decodedToken.uid,
                    email: decodedToken.email || '',
                    role: 'user',
                })

                return {
                    user,
                    tokens,
                }
            } catch (error) {
                return reply.code(401).send({
                    code: 'INVALID_FIREBASE_TOKEN',
                    error: 'Unauthorized',
                    message: 'Invalid Firebase token',
                    statusCode: 401,
                })
            }
        }
    )

    // Logout endpoint
    server.post(
        '/logout',
        {
            preHandler: server.authenticate,
            schema: {
                description: 'Logout current user (invalidate tokens)',
                tags: ['Authentication'],
                security: [{ bearerAuth: [] }],
                response: {
                    200: Type.Object({
                        message: Type.String(),
                    }),
                    401: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            // TODO: Invalidate refresh token in database/cache

            return {
                message: 'Successfully logged out',
            }
        }
    )

    // Get current user profile
    server.get(
        '/me',
        {
            preHandler: server.authenticate,
            schema: {
                description: 'Get current user profile',
                tags: ['Authentication'],
                security: [{ bearerAuth: [] }],
                response: {
                    200: UserProfileSchema,
                    401: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            return request.user!
        }
    )
}
