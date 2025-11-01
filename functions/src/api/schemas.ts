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
    favicon: Type.String({ format: 'uri' }),
    logoSmall: Type.String({ format: 'uri' }),
    languages: Type.Array(Type.String({ minLength: 2, maxLength: 5 })),
    ownerUserId: IdSchema,
    adminUserIds: Type.Array(IdSchema),
    editorUserIds: Type.Array(IdSchema),
    viewerUserIds: Type.Array(IdSchema),
    disableSoloTalkRedirect: Type.Boolean(),
    hideVotesUntilUserVote: Type.Boolean(),
    chipColors: Type.Array(Type.String({ format: 'color' })),
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
