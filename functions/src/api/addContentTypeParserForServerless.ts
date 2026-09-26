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
        if (!Buffer.isBuffer(rawBody)) {
            done(null, payload)
            return
        }
        // rawBody is already decoded (e.g. gunzipped by the platform), so the
        // original Content-Length/Encoding no longer describe the replayed
        // bytes and would fail Fastify's length check.
        request.headers['content-length'] = String(rawBody.length)
        delete request.headers['content-encoding']
        done(null, Readable.from(rawBody))
    })
    fastify.addContentTypeParser(
        'multipart/form-data',
        {},
        (req, body, done) => {
            done(null, req)
        }
    )
}
