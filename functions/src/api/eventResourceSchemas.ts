import { Static, Type } from '@sinclair/typebox'
import { EventIdSchema } from './schemas'

export const ResourceRevisionSchema = Type.String({
    pattern: '^[a-f0-9]{64}$',
    description:
        'Opaque revision from a read of this record. Required for updates.',
})

export const ResourceListQuerySchema = Type.Object(
    {
        limit: Type.Optional(
            Type.String({ pattern: '^([1-9][0-9]?|100)$', default: '100' })
        ),
        after: Type.Optional(EventIdSchema),
    },
    { additionalProperties: false }
)

export type ResourceListQuery = Static<typeof ResourceListQuerySchema>
export type EventResourceKind = 'talks' | 'speakers'
export type EventResourceAccess =
    { projectId: string } | { organizationId: string }
