import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

import {
    UserProfileSchema,
    ErrorSchema,
    IdSchema,
    PaginationQuerySchema,
    PaginationResponseSchema,
} from '../schemas'

export const usersRoutes: FastifyPluginAsync = async (server) => {
    // Get user profile by ID
    server.get(
        '/:id',
        {
            preHandler: server.authenticate,
            schema: {
                description: 'Get user profile by ID',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                params: Type.Object({
                    id: IdSchema,
                }),
                response: {
                    200: UserProfileSchema,
                    401: ErrorSchema,
                    404: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params

            // TODO: Fetch user from database
            // For now, return mock data
            if (id === 'demo-user-id') {
                return {
                    id,
                    email: 'demo@openfeedback.io',
                    firstName: 'Demo',
                    lastName: 'User',
                    role: 'user' as const,
                    isEmailVerified: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            }

            server.notFound('User')
        }
    )

    // Update user profile
    server.put(
        '/:id',
        {
            preHandler: server.authenticate,
            schema: {
                description: 'Update user profile',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                params: Type.Object({
                    id: IdSchema,
                }),
                body: Type.Object({
                    firstName: Type.Optional(
                        Type.String({ minLength: 1, maxLength: 50 })
                    ),
                    lastName: Type.Optional(
                        Type.String({ minLength: 1, maxLength: 50 })
                    ),
                    avatar: Type.Optional(Type.String({ format: 'uri' })),
                }),
                response: {
                    200: UserProfileSchema,
                    401: ErrorSchema,
                    403: ErrorSchema,
                    404: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params
            const updates = request.body

            // Check if user can update this profile
            if (
                request.user!.id !== id &&
                request.user!.role !== 'admin' &&
                request.user!.role !== 'super_admin'
            ) {
                server.forbidden('You can only update your own profile')
            }

            // TODO: Update user in database
            return {
                id,
                email: 'demo@openfeedback.io',
                firstName: updates.firstName || 'Demo',
                lastName: updates.lastName || 'User',
                avatar: updates.avatar,
                role: 'user' as const,
                isEmailVerified: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        }
    )

    // List users (admin only)
    server.get(
        '/',
        {
            preHandler: server.authenticateAdmin,
            schema: {
                description: 'List all users (admin only)',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                querystring: Type.Intersect([
                    PaginationQuerySchema,
                    Type.Object({
                        search: Type.Optional(
                            Type.String({
                                description: 'Search by email or name',
                            })
                        ),
                        role: Type.Optional(
                            Type.Union([
                                Type.Literal('user'),
                                Type.Literal('admin'),
                                Type.Literal('super_admin'),
                            ])
                        ),
                    }),
                ]),
                response: {
                    200: Type.Object({
                        users: Type.Array(UserProfileSchema),
                        pagination: PaginationResponseSchema,
                    }),
                    401: ErrorSchema,
                    403: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { page = 1, limit = 20, search, role } = request.query

            // TODO: Implement actual user search and pagination
            const mockUsers = [
                {
                    id: 'demo-user-id',
                    email: 'demo@openfeedback.io',
                    firstName: 'Demo',
                    lastName: 'User',
                    role: 'user' as const,
                    isEmailVerified: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ]

            return {
                users: mockUsers,
                pagination: {
                    page,
                    limit,
                    total: mockUsers.length,
                    totalPages: Math.ceil(mockUsers.length / limit),
                    hasNext: false,
                    hasPrev: false,
                },
            }
        }
    )

    // Delete user (admin only)
    server.delete(
        '/:id',
        {
            preHandler: server.authenticateAdmin,
            schema: {
                description: 'Delete user account (admin only)',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                params: Type.Object({
                    id: IdSchema,
                }),
                response: {
                    204: Type.Null(),
                    401: ErrorSchema,
                    403: ErrorSchema,
                    404: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params

            // TODO: Delete user from database
            // TODO: Handle cascade deletion of user's projects, etc.

            reply.code(204).send()
        }
    )
}
