import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import {
    ErrorSchema,
    EventIdSchema,
    ResourceAcknowledgementSchema,
    ResourceIdSchema,
    UpdateSpeaker,
    UpdateSpeakerSchema,
    RESOURCE_ACCESS_NOTE,
} from '../../../schemas'
import { authenticateRequest } from '../../../plugins/apiKeyPlugin'
import { SpeakerDao } from '../../../dao/SpeakerDao'
import { eventAccessFor } from '../../../services/eventAccess'

export const updateSpeakerRoute: FastifyPluginAsync = async (server) => {
    server.patch<{
        Params: { projectId: string; speakerId: string }
        Body: UpdateSpeaker
    }>(
        '/:projectId/speakers/:speakerId',
        {
            schema: {
                description:
                    RESOURCE_ACCESS_NOTE +
                    'Update supplied fields with the last-read revision. Concurrent edits return 409; ' +
                    'omitted fields, photos, schedules and votes are preserved. No records are deleted. Read again before the next edit.',
                tags: ['Speakers'],
                params: Type.Object({
                    projectId: EventIdSchema,
                    speakerId: ResourceIdSchema,
                }),
                body: UpdateSpeakerSchema,
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
            SpeakerDao.update(
                server.firebase,
                request.params.projectId,
                eventAccessFor(request),
                request.params.speakerId,
                request.body
            )
    )
}
