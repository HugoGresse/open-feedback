import { FastifyPluginAsync } from 'fastify'
import { getEventByApiKeyRoute } from './getByApiKey'
import { getEventVotesRoute } from './getVotes'

export const eventsRoutes: FastifyPluginAsync = async (server) => {
    await server.register(getEventByApiKeyRoute)
    await server.register(getEventVotesRoute)
}
