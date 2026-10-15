import { Static, Type } from '@sinclair/typebox'
import { EventIdSchema } from './common'
import { ResourceRevisionSchema } from './resources'

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
// Response schema: looser than the write schemas so legacy or imported
// records still serialize instead of failing the whole page.
export const SpeakerSchema = Type.Object({
    id: Type.String(),
    revision: ResourceRevisionSchema,
    name: Type.Optional(Type.String()),
})

export type CreateSpeaker = Static<typeof CreateSpeakerSchema>
export type UpdateSpeaker = Static<typeof UpdateSpeakerSchema>
export type Speaker = Static<typeof SpeakerSchema>
