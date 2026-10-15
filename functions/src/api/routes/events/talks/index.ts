import { FastifyPluginAsync } from 'fastify'
import { listTalksRoute } from './list'
import { getTalkRoute } from './get'
import { createTalkRoute } from './create'
import { updateTalkRoute } from './update'

export const talksRoutes: FastifyPluginAsync = async (server) => {
    await server.register(listTalksRoute)
    await server.register(getTalkRoute)
    await server.register(createTalkRoute)
    await server.register(updateTalkRoute)
}
