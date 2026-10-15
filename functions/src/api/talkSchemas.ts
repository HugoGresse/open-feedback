import { Type } from '@sinclair/typebox'
import { EventIdSchema } from './schemas'
import {
    ResourceIdSchema,
    ResourceRevisionSchema,
} from './eventResourceSchemas'

const fields = {
    title: Type.String({ minLength: 1, maxLength: 2000, pattern: '\\S' }),
    speakers: Type.Array(ResourceIdSchema, {
        maxItems: 100,
        uniqueItems: true,
    }),
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
// Response schema: looser than the write schemas so legacy or imported
// records still serialize instead of failing the whole page.
export const TalkSchema = Type.Object({
    id: Type.String(),
    revision: ResourceRevisionSchema,
    title: Type.Optional(Type.String()),
    speakers: Type.Array(Type.String()),
})
