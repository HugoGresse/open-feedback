import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

import {
    ProjectSchema,
    ErrorSchema,
    IdSchema,
    PaginationQuerySchema,
    PaginationResponseSchema,
} from '../schemas'

export const projectsRoutes: FastifyPluginAsync = async (server) => {
    // Create project
    server.post(
        '/',
        {
            preHandler: server.authenticate,
            schema: {
                description: 'Create a new project',
                tags: ['Projects'],
                security: [{ bearerAuth: [] }],
                body: Type.Object({
                    name: Type.String({ minLength: 1, maxLength: 100 }),
                    slug: Type.String({
                        pattern: '^[a-z0-9-]+$',
                        minLength: 3,
                        maxLength: 50,
                    }),
                    description: Type.Optional(
                        Type.String({ maxLength: 1000 })
                    ),
                    organizationId: IdSchema,
                    isPublic: Type.Optional(Type.Boolean({ default: false })),
                    settings: Type.Optional(
                        Type.Object({
                            allowAnonymousFeedback: Type.Optional(
                                Type.Boolean({ default: true })
                            ),
                            moderationEnabled: Type.Optional(
                                Type.Boolean({ default: false })
                            ),
                            maxFeedbackLength: Type.Optional(
                                Type.Integer({
                                    minimum: 100,
                                    maximum: 5000,
                                    default: 1000,
                                })
                            ),
                        })
                    ),
                    startDate: Type.Optional(
                        Type.String({ format: 'date-time' })
                    ),
                    endDate: Type.Optional(
                        Type.String({ format: 'date-time' })
                    ),
                }),
                response: {
                    201: ProjectSchema,
                    400: ErrorSchema,
                    401: ErrorSchema,
                    403: ErrorSchema,
                    409: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const {
                name,
                slug,
                description,
                organizationId,
                isPublic,
                settings,
                startDate,
                endDate,
            } = request.body

            // TODO: Check if user has permission to create projects in this organization
            // TODO: Check if slug is already taken within the organization
            // TODO: Validate date range
            // TODO: Create project in database

            const project = {
                id: `proj_${Date.now()}`,
                name,
                slug,
                description,
                organizationId,
                ownerId: request.user!.id,
                status: 'draft' as const,
                isPublic: isPublic ?? false,
                settings: {
                    allowAnonymousFeedback:
                        settings?.allowAnonymousFeedback ?? true,
                    moderationEnabled: settings?.moderationEnabled ?? false,
                    maxFeedbackLength: settings?.maxFeedbackLength ?? 1000,
                },
                startDate,
                endDate,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            reply.code(201).send(project)
        }
    )

    // Get project by ID
    server.get(
        '/:id',
        {
            preHandler: server.authenticateOptional,
            schema: {
                description: 'Get project by ID',
                tags: ['Projects'],
                params: Type.Object({
                    id: IdSchema,
                }),
                response: {
                    200: ProjectSchema,
                    404: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params

            // TODO: Fetch project from database
            // TODO: Check if user has access to this project

            // Mock project
            const project = {
                id,
                name: 'DevFest 2024',
                slug: 'devfest-2024',
                description: 'Annual developer conference',
                organizationId: 'org_1',
                ownerId: 'demo-user-id',
                status: 'active' as const,
                isPublic: true,
                settings: {
                    allowAnonymousFeedback: true,
                    moderationEnabled: false,
                    maxFeedbackLength: 1000,
                },
                startDate: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                ).toISOString(),
                endDate: new Date(
                    Date.now() + 9 * 24 * 60 * 60 * 1000
                ).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            return project
        }
    )

    // Update project
    server.put(
        '/:id',
        {
            preHandler: server.authenticate,
            schema: {
                description: 'Update project',
                tags: ['Projects'],
                security: [{ bearerAuth: [] }],
                params: Type.Object({
                    id: IdSchema,
                }),
                body: Type.Object({
                    name: Type.Optional(
                        Type.String({ minLength: 1, maxLength: 100 })
                    ),
                    description: Type.Optional(
                        Type.String({ maxLength: 1000 })
                    ),
                    status: Type.Optional(
                        Type.Union([
                            Type.Literal('draft'),
                            Type.Literal('active'),
                            Type.Literal('archived'),
                        ])
                    ),
                    isPublic: Type.Optional(Type.Boolean()),
                    settings: Type.Optional(
                        Type.Object({
                            allowAnonymousFeedback: Type.Optional(
                                Type.Boolean()
                            ),
                            moderationEnabled: Type.Optional(Type.Boolean()),
                            maxFeedbackLength: Type.Optional(
                                Type.Integer({ minimum: 100, maximum: 5000 })
                            ),
                        })
                    ),
                    startDate: Type.Optional(
                        Type.String({ format: 'date-time' })
                    ),
                    endDate: Type.Optional(
                        Type.String({ format: 'date-time' })
                    ),
                }),
                response: {
                    200: ProjectSchema,
                    401: ErrorSchema,
                    403: ErrorSchema,
                    404: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params
            const updates = request.body

            // TODO: Check if user has permission to update this project
            // TODO: Update project in database

            return {
                id,
                name: updates.name || 'DevFest 2024',
                slug: 'devfest-2024',
                description:
                    updates.description || 'Annual developer conference',
                organizationId: 'org_1',
                ownerId: request.user!.id,
                status: updates.status || ('active' as const),
                isPublic: updates.isPublic ?? true,
                settings: {
                    allowAnonymousFeedback:
                        updates.settings?.allowAnonymousFeedback ?? true,
                    moderationEnabled:
                        updates.settings?.moderationEnabled ?? false,
                    maxFeedbackLength:
                        updates.settings?.maxFeedbackLength ?? 1000,
                },
                startDate:
                    updates.startDate ||
                    new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                endDate:
                    updates.endDate ||
                    new Date(
                        Date.now() + 9 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        }
    )

    // List projects
    server.get(
        '/',
        {
            preHandler: server.authenticateOptional,
            schema: {
                description: 'List projects',
                tags: ['Projects'],
                querystring: Type.Intersect([
                    PaginationQuerySchema,
                    Type.Object({
                        search: Type.Optional(
                            Type.String({
                                description: 'Search by name or description',
                            })
                        ),
                        organizationId: Type.Optional(IdSchema),
                        status: Type.Optional(
                            Type.Union([
                                Type.Literal('draft'),
                                Type.Literal('active'),
                                Type.Literal('archived'),
                            ])
                        ),
                        isPublic: Type.Optional(Type.Boolean()),
                    }),
                ]),
                response: {
                    200: Type.Object({
                        projects: Type.Array(ProjectSchema),
                        pagination: PaginationResponseSchema,
                    }),
                },
            },
        },
        async (request, reply) => {
            const {
                page = 1,
                limit = 20,
                search,
                organizationId,
                status,
                isPublic,
            } = request.query

            // TODO: Implement actual project search and pagination
            // TODO: Filter by user permissions and query parameters

            const mockProjects = [
                {
                    id: 'proj_1',
                    name: 'DevFest 2024',
                    slug: 'devfest-2024',
                    description: 'Annual developer conference',
                    organizationId: 'org_1',
                    ownerId: 'demo-user-id',
                    status: 'active' as const,
                    isPublic: true,
                    settings: {
                        allowAnonymousFeedback: true,
                        moderationEnabled: false,
                        maxFeedbackLength: 1000,
                    },
                    startDate: new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                    endDate: new Date(
                        Date.now() + 9 * 24 * 60 * 60 * 1000
                    ).toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ]

            return {
                projects: mockProjects,
                pagination: {
                    page,
                    limit,
                    total: mockProjects.length,
                    totalPages: Math.ceil(mockProjects.length / limit),
                    hasNext: false,
                    hasPrev: false,
                },
            }
        }
    )

    // Delete project
    server.delete(
        '/:id',
        {
            preHandler: server.authenticate,
            schema: {
                description: 'Delete project',
                tags: ['Projects'],
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

            // TODO: Check if user has permission to delete this project
            // TODO: Handle cascade deletion of talks, feedback, etc.
            // TODO: Delete project from database

            reply.code(204).send()
        }
    )
}
