import { afterEach, describe, expect, it } from 'vitest'
import Fastify, { FastifyInstance } from 'fastify'
import { IncomingMessage } from 'node:http'
import { addContentTypeParserForServerless } from './addContentTypeParserForServerless'

describe('JSON bodies', () => {
    let fastify: FastifyInstance

    const buildApp = (rawBody?: string) => {
        fastify = Fastify({ bodyLimit: 100 })
        if (rawBody !== undefined) {
            fastify.addHook('onRequest', (request, _reply, done) => {
                const raw = request.raw as IncomingMessage & { rawBody: Buffer }
                raw.rawBody = Buffer.from(rawBody)
                done()
            })
        }
        addContentTypeParserForServerless(fastify)
        fastify.post('/', async (request) => request.body)
        return fastify
    }

    afterEach(async () => {
        await fastify?.close()
    })

    it('parses a normal JSON request stream', async () => {
        const response = await buildApp().inject({
            method: 'POST',
            url: '/',
            payload: { name: 'Event' },
        })
        expect(response.statusCode).toBe(200)
        expect(response.json()).toEqual({ name: 'Event' })
    })

    it('replays a body already consumed by Firebase', async () => {
        const rawBody = JSON.stringify({ name: 'Firebase Event' })
        const response = await buildApp(rawBody).inject({
            method: 'POST',
            url: '/',
            headers: {
                'content-type': 'application/json',
                'content-length': String(Buffer.byteLength(rawBody)),
            },
        })
        expect(response.statusCode).toBe(200)
        expect(response.json()).toEqual({ name: 'Firebase Event' })
    })

    it.each([false, true])(
        'rejects malformed JSON (Firebase: %s)',
        async (firebase) => {
            const payload = '{broken}'
            const response = await buildApp(
                firebase ? payload : undefined
            ).inject({
                method: 'POST',
                url: '/',
                headers: { 'content-type': 'application/json' },
                payload,
            })
            expect(response.statusCode).toBe(400)
        }
    )

    it.each([false, true])(
        'enforces body size limits (Firebase: %s)',
        async (firebase) => {
            const payload = JSON.stringify({ name: 'a'.repeat(200) })
            const response = await buildApp(
                firebase ? payload : undefined
            ).inject({
                method: 'POST',
                url: '/',
                headers: { 'content-type': 'application/json' },
                payload,
            })
            expect(response.statusCode).toBe(413)
        }
    )
})
