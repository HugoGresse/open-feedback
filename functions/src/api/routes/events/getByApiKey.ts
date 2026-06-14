import { FastifyPluginAsync } from 'fastify'
import { EventSchema, ErrorSchema } from '../../schemas'
import { authenticateRequest } from '../../plugins/apiKeyPlugin'

export const getEventByApiKeyRoute: FastifyPluginAsync = async (server) => {
    server.get(
        '/me',
        {
            schema: {
                description:
                    'Get the event (project) linked to the API key. ' +
                    'Requires an event API key (prefix `ofproj_`); an ' +
                    'organization key (`oforg_`) returns 404.',
                tags: ['Events'],
                response: {
                    200: EventSchema,
                    401: ErrorSchema,
                    404: ErrorSchema,
                },
            },
            preHandler: authenticateRequest,
        },
        async (request, reply) => {
            if (!request.project) {
                return reply.code(404).send({
                    error: 'Event not found',
                    success: false,
                })
            }

            // Only expose public event fields. owner/members are internal user
            // ids and must never leak through the API.
            return {
                id: request.project.id,
                name: request.project.name,
                organizationId: request.project.organizationId,
            }
        }
    )
}
