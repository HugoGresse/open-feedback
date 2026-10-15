import { FastifyPluginAsync } from 'fastify'
import {
    CreateTalkSchema,
    TalkSchema,
    UpdateTalkSchema,
} from '../../talkSchemas'
import { registerEventResourceRoutes } from './resources'

export const eventTalkRoutes: FastifyPluginAsync = async (server) => {
    await registerEventResourceRoutes(server, 'talks', 'talkId', {
        read: TalkSchema,
        create: CreateTalkSchema,
        update: UpdateTalkSchema,
    })
}
