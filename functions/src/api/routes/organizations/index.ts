import { FastifyPluginAsync } from 'fastify'
import { getOrganizationByApiKeyRoute } from './getByApiKey'

export const organizationsRoutes: FastifyPluginAsync = async (server) => {
    await server.register(getOrganizationByApiKeyRoute)
}
