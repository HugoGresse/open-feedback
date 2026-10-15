import { Type } from '@sinclair/typebox'
import { IdSchema } from './common'

export const UserSchema = Type.Object({
    id: IdSchema,
    displayName: Type.Optional(Type.String()),
    email: Type.Optional(Type.String({ format: 'email' })),
    photoUrl: Type.Optional(Type.String({ format: 'uri' })),
    createdAt: Type.Optional(Type.String({ format: 'date-time' })),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
})
