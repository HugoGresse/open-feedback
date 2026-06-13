import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const fastifyNotFoundHandler = async function (
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
) {
    reply.status(404).send({ error: 'Route not Found', success: false })
}
