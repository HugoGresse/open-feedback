import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import {
    CreateTalk,
    CreateTalkSchema,
    ErrorSchema,
    EventIdSchema,
    ResourceAcknowledgementSchema,
    RESOURCE_ACCESS_NOTE,
} from '../../../schemas'
import { authenticateRequest } from '../../../plugins/apiKeyPlugin'
import { TalkDao } from '../../../dao/TalkDao'
import { eventAccessFor } from '../../../services/eventAccess'

export const createTalkRoute: FastifyPluginAsync = async (server) => {
    server.post<{ Params: { projectId: string }; Body: CreateTalk }>(
        '/:projectId/talks',
        {
            schema: {
                description:
                    RESOURCE_ACCESS_NOTE +
                    'Create one record. Supply a stable ID for retry recovery, or omit it to generate an ID. ' +
                    'Existing IDs, or talk IDs that still have votes from a deleted talk, return 409. ' +
                    'Events managed by an external data source return 403. ' +
                    'Talk speaker IDs must already exist in this event. Read the record before updating it.',
                tags: ['Talks'],
                params: Type.Object({ projectId: EventIdSchema }),
                body: CreateTalkSchema,
                response: {
                    201: ResourceAcknowledgementSchema,
                    400: ErrorSchema,
                    401: ErrorSchema,
                    403: ErrorSchema,
                    404: ErrorSchema,
                    409: ErrorSchema,
                    503: ErrorSchema,
                },
            },
            preHandler: authenticateRequest,
        },
        async (request, reply) => {
            const record = await TalkDao.create(
                server.firebase,
                request.params.projectId,
                eventAccessFor(request),
                request.body
            )
            return reply.code(201).send(record)
        }
    )
}
