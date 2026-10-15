import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import {
    CreateSpeaker,
    CreateSpeakerSchema,
    ErrorSchema,
    EventIdSchema,
    ResourceAcknowledgementSchema,
    RESOURCE_ACCESS_NOTE,
} from '../../../schemas'
import { authenticateRequest } from '../../../plugins/apiKeyPlugin'
import { SpeakerDao } from '../../../dao/SpeakerDao'
import { eventAccessFor } from '../../../services/eventAccess'

export const createSpeakerRoute: FastifyPluginAsync = async (server) => {
    server.post<{ Params: { projectId: string }; Body: CreateSpeaker }>(
        '/:projectId/speakers',
        {
            schema: {
                description:
                    RESOURCE_ACCESS_NOTE +
                    'Create one record. Supply a stable ID for retry recovery, or omit it to generate an ID. ' +
                    'Existing IDs return 409. ' +
                    'Events managed by an external data source return 403. ' +
                    'Read the record before updating it.',
                tags: ['Speakers'],
                params: Type.Object({ projectId: EventIdSchema }),
                body: CreateSpeakerSchema,
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
            const record = await SpeakerDao.create(
                server.firebase,
                request.params.projectId,
                eventAccessFor(request),
                request.body
            )
            return reply.code(201).send(record)
        }
    )
}
