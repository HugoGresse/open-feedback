import { Type } from '@sinclair/typebox'
import { EventIdSchema } from './schemas'
import { ResourceRevisionSchema } from './eventResourceSchemas'

const fields = {
    title: Type.String({ minLength: 1, maxLength: 2000, pattern: '\\S' }),
    speakers: Type.Array(EventIdSchema, { maxItems: 100, uniqueItems: true }),
}

export const CreateTalkSchema = Type.Object(
    {
        id: Type.Optional(EventIdSchema),
        title: fields.title,
        speakers: Type.Optional(fields.speakers),
    },
    { additionalProperties: false }
)
export const UpdateTalkSchema = Type.Object(
    {
        revision: ResourceRevisionSchema,
        ...Type.Partial(Type.Object(fields)).properties,
    },
    { additionalProperties: false, minProperties: 2 }
)
export const TalkSchema = Type.Object({
    id: EventIdSchema,
    revision: ResourceRevisionSchema,
    title: Type.String(),
    speakers: Type.Array(EventIdSchema),
})
