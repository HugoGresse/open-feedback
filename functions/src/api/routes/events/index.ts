import { FastifyPluginAsync } from 'fastify'
import { getEventByApiKeyRoute } from './getByApiKey'
import { getEventVotesRoute } from './getVotes'
import { createEventRoute } from './create'
import { updateEventRoute } from './update'
import { talksRoutes } from './talks'
import { speakersRoutes } from './speakers'

export const eventsRoutes: FastifyPluginAsync = async (server) => {
    await server.register(getEventByApiKeyRoute)
    await server.register(getEventVotesRoute)
    await server.register(createEventRoute)
    await server.register(updateEventRoute)
    await server.register(talksRoutes)
    await server.register(speakersRoutes)
}
