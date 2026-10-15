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

// Firestore rejects IDs matching __.*__, so refuse them before any read.
export const EventIdSchema = Type.String({
    ...IdSchema,
    pattern: '^(?!__.*__$)[a-zA-Z0-9_-]+$',
})
