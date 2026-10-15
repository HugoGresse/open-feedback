import { Static, Type } from '@sinclair/typebox'

export const ResourceRevisionSchema = Type.String({
    pattern: '^[a-f0-9]{64}$',
    description:
        'Opaque revision from a read of this record. Required for updates.',
})

// Existing records come from the admin UI and the JSON import, which accept
// any Firestore document ID, so reads and references follow Firestore's rules
// rather than the stricter EventIdSchema used for new IDs.
export const ResourceIdSchema = Type.String({
    minLength: 1,
    maxLength: 1500,
    pattern: '^(?!\\.\\.?$)(?!__.*__$)[^/]+$',
})

export const ResourceListQuerySchema = Type.Object(
    {
        limit: Type.Optional(
            Type.String({ pattern: '^([1-9][0-9]?|100)$', default: '100' })
        ),
        after: Type.Optional(ResourceIdSchema),
    },
    { additionalProperties: false }
)

export type ResourceListQuery = Static<typeof ResourceListQuerySchema>
export type EventResourceKind = 'talks' | 'speakers'
export type EventResourceAccess =
    { projectId: string } | { organizationId: string }
