import { Type, Static } from '@sinclair/typebox'

// Common schemas
export const IdSchema = Type.String({
    description: 'Unique identifier',
    pattern: '^[a-zA-Z0-9_-]+$',
    minLength: 1,
    maxLength: 100,
})

export const TimestampSchema = Type.String({
    format: 'date-time',
    description: 'ISO 8601 timestamp',
})

export const PaginationQuerySchema = Type.Object({
    page: Type.Optional(
        Type.Integer({ minimum: 1, default: 1, description: 'Page number' })
    ),
    limit: Type.Optional(
        Type.Integer({
            minimum: 1,
            maximum: 100,
            default: 20,
            description: 'Items per page',
        })
    ),
    sort: Type.Optional(Type.String({ description: 'Sort field' })),
    order: Type.Optional(
        Type.Union([Type.Literal('asc'), Type.Literal('desc')], {
            default: 'desc',
            description: 'Sort order',
        })
    ),
})

export const PaginationResponseSchema = Type.Object({
    page: Type.Integer({ description: 'Current page number' }),
    limit: Type.Integer({ description: 'Items per page' }),
    total: Type.Integer({ description: 'Total number of items' }),
    totalPages: Type.Integer({ description: 'Total number of pages' }),
    hasNext: Type.Boolean({ description: 'Whether there are more pages' }),
    hasPrev: Type.Boolean({ description: 'Whether there are previous pages' }),
})

// Error schemas
export const ErrorSchema = Type.Object({
    code: Type.String({ description: 'Error code' }),
    error: Type.String({ description: 'Error type' }),
    message: Type.String({ description: 'Human-readable error message' }),
    statusCode: Type.Integer({ description: 'HTTP status code' }),
    timestamp: Type.Optional(TimestampSchema),
    path: Type.Optional(Type.String({ description: 'Request path' })),
    details: Type.Optional(
        Type.Any({ description: 'Additional error details' })
    ),
})

export const ValidationErrorSchema = Type.Object({
    code: Type.Literal('VALIDATION_ERROR'),
    error: Type.Literal('Bad Request'),
    message: Type.String(),
    statusCode: Type.Literal(400),
    timestamp: TimestampSchema,
    path: Type.String(),
    details: Type.Array(
        Type.Object({
            instancePath: Type.String(),
            schemaPath: Type.String(),
            keyword: Type.String(),
            params: Type.Any(),
            message: Type.String(),
        })
    ),
})

// Authentication schemas
export const AuthTokenSchema = Type.Object({
    accessToken: Type.String({ description: 'JWT access token' }),
    refreshToken: Type.String({
        description: 'Refresh token for obtaining new access tokens',
    }),
    expiresIn: Type.Integer({
        description: 'Token expiration time in seconds',
    }),
    tokenType: Type.Literal('Bearer'),
})

export const LoginRequestSchema = Type.Object({
    email: Type.String({ format: 'email', description: 'User email address' }),
    password: Type.String({ minLength: 8, description: 'User password' }),
})

export const RefreshTokenRequestSchema = Type.Object({
    refreshToken: Type.String({ description: 'Refresh token' }),
})

export const RegisterRequestSchema = Type.Object({
    email: Type.String({ format: 'email', description: 'User email address' }),
    password: Type.String({
        minLength: 8,
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
        description:
            'Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)',
    }),
    firstName: Type.String({
        minLength: 1,
        maxLength: 50,
        description: 'First name',
    }),
    lastName: Type.String({
        minLength: 1,
        maxLength: 50,
        description: 'Last name',
    }),
})

// User schemas
export const UserProfileSchema = Type.Object({
    id: IdSchema,
    email: Type.String({ format: 'email' }),
    firstName: Type.String(),
    lastName: Type.String(),
    avatar: Type.Optional(Type.String({ format: 'uri' })),
    role: Type.Union(
        [
            Type.Literal('user'),
            Type.Literal('admin'),
            Type.Literal('super_admin'),
        ],
        { description: 'User role' }
    ),
    isEmailVerified: Type.Boolean({
        description: 'Whether the email is verified',
    }),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    lastLoginAt: Type.Optional(TimestampSchema),
})

// Organization schemas
export const OrganizationSchema = Type.Object({
    id: IdSchema,
    name: Type.String({
        minLength: 1,
        maxLength: 100,
        description: 'Organization name',
    }),
    slug: Type.String({
        pattern: '^[a-z0-9-]+$',
        minLength: 3,
        maxLength: 50,
        description: 'URL-friendly organization identifier',
    }),
    description: Type.Optional(Type.String({ maxLength: 500 })),
    logoUrl: Type.Optional(Type.String({ format: 'uri' })),
    website: Type.Optional(Type.String({ format: 'uri' })),
    ownerId: IdSchema,
    settings: Type.Object({
        allowPublicProjects: Type.Boolean({ default: false }),
        requireApproval: Type.Boolean({ default: true }),
    }),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
})

// Project schemas
export const ProjectSchema = Type.Object({
    id: IdSchema,
    name: Type.String({ minLength: 1, maxLength: 100 }),
    slug: Type.String({ pattern: '^[a-z0-9-]+$', minLength: 3, maxLength: 50 }),
    description: Type.Optional(Type.String({ maxLength: 1000 })),
    organizationId: IdSchema,
    ownerId: IdSchema,
    status: Type.Union(
        [
            Type.Literal('draft'),
            Type.Literal('active'),
            Type.Literal('archived'),
        ],
        { default: 'draft' }
    ),
    isPublic: Type.Boolean({ default: false }),
    settings: Type.Object({
        allowAnonymousFeedback: Type.Boolean({ default: true }),
        moderationEnabled: Type.Boolean({ default: false }),
        maxFeedbackLength: Type.Integer({
            minimum: 100,
            maximum: 5000,
            default: 1000,
        }),
    }),
    startDate: Type.Optional(TimestampSchema),
    endDate: Type.Optional(TimestampSchema),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
})

// Export types
export type Id = Static<typeof IdSchema>
export type PaginationQuery = Static<typeof PaginationQuerySchema>
export type PaginationResponse = Static<typeof PaginationResponseSchema>
export type ErrorResponse = Static<typeof ErrorSchema>
export type ValidationErrorResponse = Static<typeof ValidationErrorSchema>
export type AuthToken = Static<typeof AuthTokenSchema>
export type LoginRequest = Static<typeof LoginRequestSchema>
export type RefreshTokenRequest = Static<typeof RefreshTokenRequestSchema>
export type RegisterRequest = Static<typeof RegisterRequestSchema>
export type UserProfile = Static<typeof UserProfileSchema>
export type Organization = Static<typeof OrganizationSchema>
export type Project = Static<typeof ProjectSchema>
