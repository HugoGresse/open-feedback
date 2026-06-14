import { FastifyPluginAsync } from 'fastify'
import { getEventByApiKeyRoute } from './getByApiKey'

export const eventsRoutes: FastifyPluginAsync = async (server) => {
    await server.register(getEventByApiKeyRoute)
}
