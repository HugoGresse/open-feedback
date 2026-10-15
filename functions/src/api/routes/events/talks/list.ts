import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import {
    ErrorSchema,
    EventIdSchema,
    NextCursorSchema,
    ResourceListQuery,
    ResourceListQuerySchema,
    TalkSchema,
    RESOURCE_ACCESS_NOTE,
} from '../../../schemas'
import { authenticateRequest } from '../../../plugins/apiKeyPlugin'
import { TalkDao } from '../../../dao/TalkDao'
import { eventAccessFor } from '../../../services/eventAccess'

export const listTalksRoute: FastifyPluginAsync = async (server) => {
    server.get<{
        Params: { projectId: string }
        Querystring: ResourceListQuery
    }>(
        '/:projectId/talks',
        {
            schema: {
                description:
                    RESOURCE_ACCESS_NOTE +
                    'List public fields and revisions, ordered by document ID. ' +
                    'Use nextCursor as `after` for the next page; limit defaults to 100.',
                tags: ['Talks'],
                params: Type.Object({ projectId: EventIdSchema }),
                querystring: ResourceListQuerySchema,
                response: {
                    200: Type.Object({
                        id: EventIdSchema,
                        talks: Type.Array(TalkSchema),
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
            const page = await TalkDao.list(
                server.firebase,
                projectId,
                eventAccessFor(request),
                Number(request.query.limit),
                request.query.after
            )
            return {
                id: projectId,
                talks: page.items,
                nextCursor: page.nextCursor,
            }
        }
    )
}
