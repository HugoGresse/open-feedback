import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

import {
    OrganizationSchema,
    ErrorSchema,
    IdSchema,
    PaginationQuerySchema,
    PaginationResponseSchema,
} from '../schemas'

export const organizationsRoutes: FastifyPluginAsync = async (server) => {
    // Create organization
    server.post(
        '/',
        {
            preHandler: server.authenticate,
            schema: {
                description: 'Create a new organization',
                tags: ['Organizations'],
                security: [{ bearerAuth: [] }],
                body: Type.Object({
                    name: Type.String({ minLength: 1, maxLength: 100 }),
                    slug: Type.String({
                        pattern: '^[a-z0-9-]+$',
                        minLength: 3,
                        maxLength: 50,
                    }),
                    description: Type.Optional(Type.String({ maxLength: 500 })),
                    logoUrl: Type.Optional(Type.String({ format: 'uri' })),
                    website: Type.Optional(Type.String({ format: 'uri' })),
                    settings: Type.Optional(
                        Type.Object({
                            allowPublicProjects: Type.Optional(
                                Type.Boolean({ default: false })
                            ),
                            requireApproval: Type.Optional(
                                Type.Boolean({ default: true })
                            ),
                        })
                    ),
                }),
                response: {
                    201: OrganizationSchema,
                    400: ErrorSchema,
                    401: ErrorSchema,
                    409: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { name, slug, description, logoUrl, website, settings } =
                request.body

            // TODO: Check if slug is already taken
            // TODO: Create organization in database

            const organization = {
                id: `org_${Date.now()}`,
                name,
                slug,
                description,
                logoUrl,
                website,
                ownerId: request.user!.id,
                settings: {
                    allowPublicProjects: settings?.allowPublicProjects ?? false,
                    requireApproval: settings?.requireApproval ?? true,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            reply.code(201).send(organization)
        }
    )

    // Get organization by ID
    server.get(
        '/:id',
        {
            preHandler: server.authenticateOptional,
            schema: {
                description: 'Get organization by ID',
                tags: ['Organizations'],
                params: Type.Object({
                    id: IdSchema,
                }),
                response: {
                    200: OrganizationSchema,
                    404: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params

            // TODO: Fetch organization from database
            // TODO: Check if user has access to this organization

            // Mock organization
            const organization = {
                id,
                name: 'OpenFeedback Demo',
                slug: 'openfeedback-demo',
                description: 'Demo organization for OpenFeedback',
                ownerId: 'demo-user-id',
                settings: {
                    allowPublicProjects: true,
                    requireApproval: false,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            return organization
        }
    )

    // Update organization
    server.put(
        '/:id',
        {
            preHandler: server.authenticate,
            schema: {
                description: 'Update organization',
                tags: ['Organizations'],
                security: [{ bearerAuth: [] }],
                params: Type.Object({
                    id: IdSchema,
                }),
                body: Type.Object({
                    name: Type.Optional(
                        Type.String({ minLength: 1, maxLength: 100 })
                    ),
                    description: Type.Optional(Type.String({ maxLength: 500 })),
                    logoUrl: Type.Optional(Type.String({ format: 'uri' })),
                    website: Type.Optional(Type.String({ format: 'uri' })),
                    settings: Type.Optional(
                        Type.Object({
                            allowPublicProjects: Type.Optional(Type.Boolean()),
                            requireApproval: Type.Optional(Type.Boolean()),
                        })
                    ),
                }),
                response: {
                    200: OrganizationSchema,
                    401: ErrorSchema,
                    403: ErrorSchema,
                    404: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params
            const updates = request.body

            // TODO: Check if user is owner or admin of the organization
            // TODO: Update organization in database

            return {
                id,
                name: updates.name || 'OpenFeedback Demo',
                slug: 'openfeedback-demo',
                description: updates.description,
                logoUrl: updates.logoUrl,
                website: updates.website,
                ownerId: request.user!.id,
                settings: {
                    allowPublicProjects:
                        updates.settings?.allowPublicProjects ?? true,
                    requireApproval: updates.settings?.requireApproval ?? false,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        }
    )

    // List organizations
    server.get(
        '/',
        {
            preHandler: server.authenticateOptional,
            schema: {
                description: 'List organizations',
                tags: ['Organizations'],
                querystring: Type.Intersect([
                    PaginationQuerySchema,
                    Type.Object({
                        search: Type.Optional(
                            Type.String({
                                description: 'Search by name or description',
                            })
                        ),
                        owner: Type.Optional(IdSchema),
                    }),
                ]),
                response: {
                    200: Type.Object({
                        organizations: Type.Array(OrganizationSchema),
                        pagination: PaginationResponseSchema,
                    }),
                },
            },
        },
        async (request, reply) => {
            const { page = 1, limit = 20, search, owner } = request.query

            // TODO: Implement actual organization search and pagination
            // TODO: Filter by user permissions

            const mockOrganizations = [
                {
                    id: 'org_1',
                    name: 'OpenFeedback Demo',
                    slug: 'openfeedback-demo',
                    description: 'Demo organization for OpenFeedback',
                    ownerId: 'demo-user-id',
                    settings: {
                        allowPublicProjects: true,
                        requireApproval: false,
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ]

            return {
                organizations: mockOrganizations,
                pagination: {
                    page,
                    limit,
                    total: mockOrganizations.length,
                    totalPages: Math.ceil(mockOrganizations.length / limit),
                    hasNext: false,
                    hasPrev: false,
                },
            }
        }
    )

    // Delete organization
    server.delete(
        '/:id',
        {
            preHandler: server.authenticate,
            schema: {
                description: 'Delete organization',
                tags: ['Organizations'],
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

            // TODO: Check if user is owner of the organization
            // TODO: Handle cascade deletion of projects, etc.
            // TODO: Delete organization from database

            reply.code(204).send()
        }
    )

    // Get organization members
    server.get(
        '/:id/members',
        {
            preHandler: server.authenticate,
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
