import { Static, Type } from '@sinclair/typebox'

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

const HttpUrlSchema = Type.String({ format: 'uri', pattern: '^https?://' })

export const EventSettingsSchema = Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100, pattern: '\\S' }),
    setupType: Type.Optional(
        Type.Union([
            Type.Literal('openfeedbackv1'),
            Type.Literal('jsonurl'),
            Type.Literal('hoverboardv2'),
        ])
    ),
    config: Type.Optional(
        Type.Object(
            {
                jsonUrl: Type.Optional(HttpUrlSchema),
                projectId: Type.Optional(Type.String({ minLength: 1 })),
                apiKey: Type.Optional(Type.String({ minLength: 1 })),
                databaseURL: Type.Optional(HttpUrlSchema),
            },
            { additionalProperties: false }
        )
    ),
    scheduleLink: Type.Optional(Type.Union([HttpUrlSchema, Type.Literal('')])),
    favicon: Type.Optional(HttpUrlSchema),
    logoSmall: Type.Optional(HttpUrlSchema),
    languages: Type.Optional(
        Type.Array(Type.String({ minLength: 2, maxLength: 5 }), {
            uniqueItems: true,
        })
    ),
    chipColors: Type.Optional(
        Type.Array(Type.String({ pattern: '^[a-fA-F0-9]{6}$' }), {
            minItems: 1,
        })
    ),
    hideEventName: Type.Optional(Type.Boolean()),
    disableSoloTalkRedirect: Type.Optional(Type.Boolean()),
    hideVotesUntilUserVote: Type.Optional(Type.Boolean()),
    displayFullDates: Type.Optional(Type.Boolean()),
    voteStartTime: Type.Optional(
        Type.Union([Type.String({ format: 'date-time' }), Type.Null()])
    ),
    voteEndTime: Type.Optional(
        Type.Union([Type.String({ format: 'date-time' }), Type.Null()])
    ),
})

export const CreateEventSchema = Type.Object(
    {
        ...EventSettingsSchema.properties,
        id: Type.Optional(
            Type.String({
                ...IdSchema,
                pattern: '^(?!__.*__$)[a-zA-Z0-9_-]+$',
                description: 'Event ID. Generated automatically when omitted.',
            })
        ),
    },
    { additionalProperties: false }
)

export const UpdateEventSchema = Type.Partial(EventSettingsSchema, {
    additionalProperties: false,
    minProperties: 1,
})

export type EventSettings = Static<typeof EventSettingsSchema>
export type CreateEvent = Static<typeof CreateEventSchema>
export type UpdateEvent = Static<typeof UpdateEventSchema>

export const EventSchema = Type.Object({
    ...EventSettingsSchema.properties,
    id: IdSchema,
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
