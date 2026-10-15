import { Type } from '@sinclair/typebox'
import { IdSchema } from './common'
import { UserSchema } from './users'

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
