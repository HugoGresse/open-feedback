import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import {
    ErrorSchema,
    EventIdSchema,
    EventSchema,
    UpdateEvent,
    UpdateEventSchema,
} from '../../schemas'
import { authenticateRequest } from '../../plugins/apiKeyPlugin'
import { ProjectDao } from '../../dao/ProjectDao'
import { eventAccessFor } from '../../services/eventAccess'
import { publicEvent } from '../../services/eventSettings'

export const updateEventRoute: FastifyPluginAsync = async (server) => {
    server.patch<{ Params: { projectId: string }; Body: UpdateEvent }>(
        '/:projectId',
        {
            schema: {
                description:
                    'Update an event with its event API key (`ofproj_`) or its organization API key (`oforg_`). ' +
                    'Omitted fields are preserved; supplied arrays and config replace the previous value. ' +
                    'Set both voteStartTime and voteEndTime to null to remove voting restrictions. ' +
                    'Ownership, organization, members and API keys cannot be changed.',
                tags: ['Events'],
                params: Type.Object({ projectId: EventIdSchema }),
                body: UpdateEventSchema,
                response: {
                    200: EventSchema,
                    400: ErrorSchema,
                    401: ErrorSchema,
                    404: ErrorSchema,
                    503: ErrorSchema,
                },
            },
            preHandler: authenticateRequest,
        },
        async (request) => {
            const project = await ProjectDao.updateProject(
                server.firebase,
                request.params.projectId,
                eventAccessFor(request),
                request.body
            )
            return publicEvent(project)
        }
    )
}
