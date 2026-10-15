import { FastifyPluginAsync } from 'fastify'
import { listSpeakersRoute } from './list'
import { getSpeakerRoute } from './get'
import { createSpeakerRoute } from './create'
import { updateSpeakerRoute } from './update'

export const speakersRoutes: FastifyPluginAsync = async (server) => {
    await server.register(listSpeakersRoute)
    await server.register(getSpeakerRoute)
    await server.register(createSpeakerRoute)
    await server.register(updateSpeakerRoute)
}
