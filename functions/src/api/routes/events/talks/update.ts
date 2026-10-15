import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import {
    ErrorSchema,
    EventIdSchema,
    ResourceAcknowledgementSchema,
    ResourceIdSchema,
    UpdateTalk,
    UpdateTalkSchema,
    RESOURCE_ACCESS_NOTE,
} from '../../../schemas'
import { authenticateRequest } from '../../../plugins/apiKeyPlugin'
import { TalkDao } from '../../../dao/TalkDao'
import { eventAccessFor } from '../../../services/eventAccess'

export const updateTalkRoute: FastifyPluginAsync = async (server) => {
    server.patch<{
        Params: { projectId: string; talkId: string }
        Body: UpdateTalk
    }>(
        '/:projectId/talks/:talkId',
        {
            schema: {
                description:
                    RESOURCE_ACCESS_NOTE +
                    'Update supplied fields with the last-read revision. Concurrent edits return 409; ' +
                    'omitted fields, photos, schedules and votes are preserved. No records are deleted. Read again before the next edit.',
                tags: ['Talks'],
                params: Type.Object({
                    projectId: EventIdSchema,
                    talkId: ResourceIdSchema,
                }),
                body: UpdateTalkSchema,
                response: {
                    200: ResourceAcknowledgementSchema,
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
        async (request) =>
            TalkDao.update(
                server.firebase,
                request.params.projectId,
                eventAccessFor(request),
                request.params.talkId,
                request.body
            )
    )
}
