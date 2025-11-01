import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { HttpError } from './Errors'

export const fastifyErrorHandler = async function (
    this: FastifyInstance,
    error:
        | (Error & {
              code: string
              statusCode: number
              validation: any[]
          })
        | HttpError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    if (error instanceof HttpError) {
        reply.header('content-type', 'application/json')
        reply
            .status(error.statusCode)
            .send(JSON.stringify({ error: error.message, success: false }))
    } else {
        console.error(request.originalUrl, error)
        reply.header('content-type', 'application/json')
        if (error.code && error.statusCode) {
            reply.status(error.statusCode).send(
                JSON.stringify({
                    error: error.code,
                    reason: error.toString(),
                    success: false,
                })
            )
        } else {
            reply.status(500).send(
                JSON.stringify({
                    error: error,
                    reason: error.message || JSON.stringify(error),
                    success: false,
                })
            )
        }
    }
}
