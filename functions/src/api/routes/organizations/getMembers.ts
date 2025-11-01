import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import {
    ErrorSchema,
    IdSchema,
    PaginationQuerySchema,
    PaginationResponseSchema,
} from '../../schemas'

export const getOrganizationMembersRoute: FastifyPluginAsync = async (
    server
) => {
    server.get(
        '/:id/members',
        {
            schema: {
                description: 'Get organization members',
                tags: ['Organizations'],
                security: [{ bearerAuth: [] }],
                params: Type.Object({
                    id: IdSchema,
                }),
                querystring: PaginationQuerySchema,
                response: {
                    200: Type.Object({
                        members: Type.Array(
                            Type.Object({
                                userId: IdSchema,
                                email: Type.String({ format: 'email' }),
                                firstName: Type.String(),
                                lastName: Type.String(),
                                role: Type.Union([
                                    Type.Literal('member'),
                                    Type.Literal('admin'),
                                    Type.Literal('owner'),
                                ]),
                                joinedAt: Type.String({ format: 'date-time' }),
                            })
                        ),
                        pagination: PaginationResponseSchema,
                    }),
                    401: ErrorSchema,
                    403: ErrorSchema,
                    404: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params
            const { page = 1, limit = 20 } = request.query

            // TODO: Check if user has access to view members
            // TODO: Fetch members from database

            const mockMembers = [
                {
                    userId: 'demo-user-id',
                    email: 'demo@openfeedback.io',
                    firstName: 'Demo',
                    lastName: 'User',
                    role: 'owner' as const,
                    joinedAt: new Date().toISOString(),
                },
            ]

            return {
                members: mockMembers,
                pagination: {
                    page,
                    limit,
                    total: mockMembers.length,
                    totalPages: Math.ceil(mockMembers.length / limit),
                    hasNext: false,
                    hasPrev: false,
                },
            }
        }
    )
}
