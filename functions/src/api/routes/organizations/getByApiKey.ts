import { FastifyPluginAsync } from 'fastify'
import { OrganizationSchema, ErrorSchema } from '../../schemas'

export const getOrganizationByApiKeyRoute: FastifyPluginAsync = async (
    server
) => {
    server.get(
        '/me',
        {
            schema: {
                description: 'Get organization linked to the API key',
                tags: ['Organizations'],
                response: {
                    200: OrganizationSchema,
                    401: ErrorSchema,
                    404: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            // The organization is already hydrated by the API key plugin
            if (!request.organization) {
                return reply.code(404).send({
                    error: 'Organization not found',
                    success: false,
                })
            }

            return request.organization
        }
    )
}
