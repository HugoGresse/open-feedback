import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const fastifyNotFoundHandler = async function (
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
) {
    reply.status(404).send({ error: 'Not Found', success: false })
}
