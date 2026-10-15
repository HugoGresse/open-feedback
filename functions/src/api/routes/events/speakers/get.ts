import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import {
    ErrorSchema,
    EventIdSchema,
    ResourceIdSchema,
    SpeakerSchema,
    RESOURCE_ACCESS_NOTE,
} from '../../../schemas'
import { authenticateRequest } from '../../../plugins/apiKeyPlugin'
import { SpeakerDao } from '../../../dao/SpeakerDao'
import { eventAccessFor } from '../../../services/eventAccess'

export const getSpeakerRoute: FastifyPluginAsync = async (server) => {
    server.get<{ Params: { projectId: string; speakerId: string } }>(
        '/:projectId/speakers/:speakerId',
        {
            schema: {
                description:
                    RESOURCE_ACCESS_NOTE +
                    'Read public fields and the revision of one record.',
                tags: ['Speakers'],
                params: Type.Object({
                    projectId: EventIdSchema,
                    speakerId: ResourceIdSchema,
                }),
                response: {
                    200: SpeakerSchema,
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
            SpeakerDao.get(
                server.firebase,
                request.params.projectId,
                eventAccessFor(request),
                request.params.speakerId
            )
    )
}
