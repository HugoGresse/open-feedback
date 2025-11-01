import { Type } from '@sinclair/typebox'

export const IdSchema = Type.String({
    pattern: '^[a-zA-Z0-9_-]+$',
    minLength: 1,
    maxLength: 100,
})

export const ErrorSchema = Type.Object({
    error: Type.String(),
    success: Type.Boolean(),
})

export const OrganizationSchema = Type.Object({
    id: IdSchema,
    name: Type.String({ minLength: 1, maxLength: 100 }),
    slug: Type.String({
        pattern: '^[a-z0-9-]+$',
        minLength: 3,
        maxLength: 50,
    }),
    description: Type.Optional(Type.String({ maxLength: 500 })),
    logoUrl: Type.Optional(Type.String({ format: 'uri' })),
    website: Type.Optional(Type.String({ format: 'uri' })),
    ownerId: IdSchema,
    settings: Type.Object({
        allowPublicProjects: Type.Boolean(),
        requireApproval: Type.Boolean(),
    }),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
})

export const PaginationQuerySchema = Type.Object({
    page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
    limit: Type.Optional(
        Type.Integer({ minimum: 1, maximum: 100, default: 20 })
    ),
})

export const PaginationResponseSchema = Type.Object({
    page: Type.Integer({ minimum: 1 }),
    limit: Type.Integer({ minimum: 1 }),
    total: Type.Integer({ minimum: 0 }),
    totalPages: Type.Integer({ minimum: 0 }),
    hasNext: Type.Boolean(),
    hasPrev: Type.Boolean(),
})
