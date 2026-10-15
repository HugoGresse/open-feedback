import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import {
    ErrorSchema,
    EventIdSchema,
    NextCursorSchema,
    ResourceListQuery,
    ResourceListQuerySchema,
    SpeakerSchema,
    RESOURCE_ACCESS_NOTE,
} from '../../../schemas'
import { authenticateRequest } from '../../../plugins/apiKeyPlugin'
import { SpeakerDao } from '../../../dao/SpeakerDao'
import { eventAccessFor } from '../../../services/eventAccess'

export const listSpeakersRoute: FastifyPluginAsync = async (server) => {
    server.get<{
        Params: { projectId: string }
        Querystring: ResourceListQuery
    }>(
        '/:projectId/speakers',
        {
            schema: {
                description:
                    RESOURCE_ACCESS_NOTE +
                    'List public fields and revisions, ordered by document ID. ' +
                    'Use nextCursor as `after` for the next page; limit defaults to 100.',
                tags: ['Speakers'],
                params: Type.Object({ projectId: EventIdSchema }),
                querystring: ResourceListQuerySchema,
                response: {
                    200: Type.Object({
                        id: EventIdSchema,
                        speakers: Type.Array(SpeakerSchema),
                        nextCursor: NextCursorSchema,
                    }),
                    400: ErrorSchema,
                    401: ErrorSchema,
                    403: ErrorSchema,
                    404: ErrorSchema,
                    503: ErrorSchema,
                },
            },
            preHandler: authenticateRequest,
        },
        async (request) => {
            const { projectId } = request.params
            const page = await SpeakerDao.list(
                server.firebase,
                projectId,
                eventAccessFor(request),
                Number(request.query.limit),
                request.query.after
            )
            return {
                id: projectId,
                speakers: page.items,
                nextCursor: page.nextCursor,
            }
        }
    )
}
