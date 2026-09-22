import { FastifyInstance } from 'fastify'
import { IncomingMessage } from 'node:http'
import { Readable } from 'node:stream'

export const addContentTypeParserForServerless = (fastify: FastifyInstance) => {
    // Firebase has already consumed the stream, but preserves its raw bytes.
    // Replay those through Fastify's standard parser (including JSON safety and
    // body-size checks). Standalone requests keep their original stream.
    fastify.addHook('preParsing', (request, _reply, payload, done) => {
        const { rawBody } = request.raw as IncomingMessage & {
            rawBody?: Buffer
        }
        done(null, Buffer.isBuffer(rawBody) ? Readable.from(rawBody) : payload)
    })
    fastify.addContentTypeParser(
        'multipart/form-data',
        {},
        (req, body, done) => {
            done(null, req)
        }
    )
}
