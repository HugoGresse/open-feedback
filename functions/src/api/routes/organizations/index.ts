import { FastifyPluginAsync } from 'fastify'
import { getOrganizationByApiKeyRoute } from './getByApiKey'
import { getOrganizationByIdRoute } from './getById'
import { getOrganizationMembersRoute } from './getMembers'

export const organizationsRoutes: FastifyPluginAsync = async (server) => {
    await server.register(getOrganizationByApiKeyRoute)
    await server.register(getOrganizationByIdRoute)
    await server.register(getOrganizationMembersRoute)
}
