import { FastifyPluginAsync } from 'fastify'
import { getOrganizationByApiKeyRoute } from './getByApiKey'
import { getOrganizationByIdRoute } from './getById'

export const organizationsRoutes: FastifyPluginAsync = async (server) => {
    await server.register(getOrganizationByApiKeyRoute)
    await server.register(getOrganizationByIdRoute)
}
