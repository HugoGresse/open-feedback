import { Type } from '@sinclair/typebox'
import { EventIdSchema } from './schemas'
import { ResourceRevisionSchema } from './eventResourceSchemas'

const fields = {
    name: Type.String({ minLength: 1, maxLength: 200, pattern: '\\S' }),
}

export const CreateSpeakerSchema = Type.Object(
    { id: Type.Optional(EventIdSchema), ...fields },
    { additionalProperties: false }
)
export const UpdateSpeakerSchema = Type.Object(
    { revision: ResourceRevisionSchema, ...fields },
    { additionalProperties: false }
)
export const SpeakerSchema = Type.Object({
    id: EventIdSchema,
    revision: ResourceRevisionSchema,
    name: Type.String(),
})
