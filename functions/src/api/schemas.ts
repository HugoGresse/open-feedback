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

export const UserSchema = Type.Object({
    id: IdSchema,
    displayName: Type.Optional(Type.String()),
    email: Type.Optional(Type.String({ format: 'email' })),
    photoUrl: Type.Optional(Type.String({ format: 'uri' })),
    createdAt: Type.Optional(Type.String({ format: 'date-time' })),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
})

export const OrganizationSchema = Type.Object({
    id: IdSchema,
    name: Type.String({ minLength: 1, maxLength: 100 }),
    favicon: Type.Optional(Type.String({ format: 'uri' })),
    logoSmall: Type.Optional(Type.String({ format: 'uri' })),
    languages: Type.Optional(
        Type.Array(Type.String({ minLength: 2, maxLength: 5 }))
    ),
    ownerUser: UserSchema,
    adminUsers: Type.Array(UserSchema),
    editorUsers: Type.Array(UserSchema),
    viewerUsers: Type.Array(UserSchema),
    disableSoloTalkRedirect: Type.Optional(Type.Boolean()),
    hideVotesUntilUserVote: Type.Optional(Type.Boolean()),
    chipColors: Type.Optional(Type.Array(Type.String({ format: 'color' }))),
    createdAt: Type.Optional(Type.String({ format: 'date-time' })),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
})

export const EventSchema = Type.Object({
    id: IdSchema,
    name: Type.String({ minLength: 1, maxLength: 100 }),
    organizationId: Type.Optional(IdSchema),
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
