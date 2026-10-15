import { FastifyPluginAsync } from 'fastify'
import {
    CreateSpeakerSchema,
    SpeakerSchema,
    UpdateSpeakerSchema,
} from '../../speakerSchemas'
import { registerEventResourceRoutes } from './resources'

export const eventSpeakerRoutes: FastifyPluginAsync = async (server) => {
    await registerEventResourceRoutes(server, 'speakers', 'speakerId', {
        read: SpeakerSchema,
        create: CreateSpeakerSchema,
        update: UpdateSpeakerSchema,
    })
}
