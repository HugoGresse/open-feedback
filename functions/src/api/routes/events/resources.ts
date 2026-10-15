import { FastifyInstance, FastifyRequest } from 'fastify'
import { Type, TSchema } from '@sinclair/typebox'
import {
    EventResourceAccess,
    EventResourceKind,
    ResourceListQuery,
    ResourceListQuerySchema,
} from '../../eventResourceSchemas'
import { EventResourceDao } from '../../dao/EventResourceDao'
import { NotFoundError } from '../../others/Errors'
import { authenticateRequest } from '../../plugins/apiKeyPlugin'
import { ErrorSchema, EventIdSchema } from '../../schemas'

const accessFor = (request: FastifyRequest): EventResourceAccess => {
    if (request.project) return { projectId: request.project.id }
    if (request.organization) return { organizationId: request.organization.id }
    throw new NotFoundError('Event not found')
}
const errors = {
    400: ErrorSchema,
    401: ErrorSchema,
    404: ErrorSchema,
    409: ErrorSchema,
}
const acknowledgement = Type.Object({ id: EventIdSchema })

export const registerEventResourceRoutes = async (
    server: FastifyInstance,
    kind: EventResourceKind,
    idParam: 'talkId' | 'speakerId',
    schemas: { read: TSchema; create: TSchema; update: TSchema }
) => {
    const base = `/:projectId/${kind}`
    const params = Type.Object({ projectId: EventIdSchema })
    const recordParams = Type.Object({
        ...params.properties,
        [idParam]: EventIdSchema,
    })
    const common = { tags: [kind === 'talks' ? 'Talks' : 'Speakers'] }
    const authorization =
        'Requires the event key or its organization key and an openfeedbackv1 event. '

    server.get<{
        Params: { projectId: string }
        Querystring: ResourceListQuery
    }>(
        base,
        {
            preHandler: authenticateRequest,
            schema: {
                ...common,
                params,
                querystring: ResourceListQuerySchema,
                description:
                    authorization +
                    'List public fields and revisions, ordered by document ID. Use nextCursor as after for the next page; limit defaults to 100.',
                response: {
                    ...errors,
                    200: Type.Object({
                        id: EventIdSchema,
                        [kind]: Type.Array(schemas.read),
                        nextCursor: Type.Union([EventIdSchema, Type.Null()]),
                    }),
                },
            },
        },
        async (request) =>
            EventResourceDao.list(
                server.firebase,
                request.params.projectId,
                accessFor(request),
                kind,
                Number(request.query.limit ?? '100'),
                request.query.after
            )
    )

    server.get<{ Params: Record<string, string> }>(
        `${base}/:${idParam}`,
        {
            preHandler: authenticateRequest,
            schema: {
                ...common,
                params: recordParams,
                description:
                    authorization +
                    'Read public fields and the revision of one record.',
                response: { ...errors, 200: schemas.read },
            },
        },
        async (request) =>
            EventResourceDao.get(
                server.firebase,
                request.params.projectId,
                accessFor(request),
                kind,
                request.params[idParam]
            )
    )

    server.post<{
        Params: { projectId: string }
        Body: Record<string, unknown>
    }>(
        base,
        {
            preHandler: authenticateRequest,
            schema: {
                ...common,
                params,
                body: schemas.create,
                description:
                    authorization +
                    'Create one record. Supply a stable ID for retry recovery, or omit it to generate an ID. Existing IDs return 409. Talk speaker IDs must already exist in this event. Read the record before updating it.',
                response: { ...errors, 201: acknowledgement },
            },
        },
        async (request, reply) =>
            reply
                .code(201)
                .send(
                    await EventResourceDao.create(
                        server.firebase,
                        request.params.projectId,
                        accessFor(request),
                        kind,
                        request.body
                    )
                )
    )

    server.patch<{
        Params: Record<string, string>
        Body: Record<string, unknown>
    }>(
        `${base}/:${idParam}`,
        {
            preHandler: authenticateRequest,
            schema: {
                ...common,
                params: recordParams,
                body: schemas.update,
                description:
                    authorization +
                    'Update supplied fields with the last-read revision. Concurrent edits return 409; omitted fields, photos, schedules and votes are preserved. No records are deleted. Read again before the next edit.',
                response: { ...errors, 200: acknowledgement },
            },
        },
        async (request) =>
            EventResourceDao.update(
                server.firebase,
                request.params.projectId,
                accessFor(request),
                kind,
                request.params[idParam],
                request.body
            )
    )
}
