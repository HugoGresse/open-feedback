import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import {
    ErrorSchema,
    EventIdSchema,
    ResourceIdSchema,
    TalkSchema,
    RESOURCE_ACCESS_NOTE,
} from '../../../schemas'
import { authenticateRequest } from '../../../plugins/apiKeyPlugin'
import { TalkDao } from '../../../dao/TalkDao'
import { eventAccessFor } from '../../../services/eventAccess'

export const getTalkRoute: FastifyPluginAsync = async (server) => {
    server.get<{ Params: { projectId: string; talkId: string } }>(
        '/:projectId/talks/:talkId',
        {
            schema: {
                description:
                    RESOURCE_ACCESS_NOTE +
                    'Read public fields and the revision of one record.',
                tags: ['Talks'],
                params: Type.Object({
                    projectId: EventIdSchema,
                    talkId: ResourceIdSchema,
                }),
                response: {
                    200: TalkSchema,
                    400: ErrorSchema,
                    401: ErrorSchema,
                    403: ErrorSchema,
                    404: ErrorSchema,
                    503: ErrorSchema,
                },
            },
            preHandler: authenticateRequest,
        },
        async (request) =>
            TalkDao.get(
                server.firebase,
                request.params.projectId,
                eventAccessFor(request),
                request.params.talkId
            )
    )
}
