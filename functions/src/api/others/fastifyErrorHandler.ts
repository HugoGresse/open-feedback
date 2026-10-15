import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { HttpError } from './Errors'

// gRPC status the Firestore SDK reports once a transaction has exhausted its
// retries under contention. Numeric to avoid a runtime import of the SDK here.
const FIRESTORE_ABORTED = 10

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
    } else if ((error as { code?: unknown }).code === FIRESTORE_ABORTED) {
        reply.header('content-type', 'application/json')
        reply.status(503).send(
            JSON.stringify({
                error: 'Too many concurrent changes; retry later',
                success: false,
            })
        )
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
