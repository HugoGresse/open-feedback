import { FastifyInstance } from 'fastify'

export const addContentTypeParserForServerless = (fastify: FastifyInstance) => {
    // For serverless compatibility: when running behind the Firebase Functions
    // (Cloud Run) adapter, the platform already parses the JSON body and exposes
    // it on the incoming request, so we reuse `body.body` here.
    // NOTE: this does NOT parse a real request stream, so JSON POST bodies sent
    // to the standalone dev server (`npm run dev:api`) resolve to `undefined`.
    // There are no body-consuming (POST/PUT/PATCH) routes yet; when the first
    // one is added, make this env-aware (parse the stream for standalone) and
    // cover it with a test.
    fastify.addContentTypeParser('application/json', {}, (req, body, done) => {
        done(null, (body as any).body)
    })
    fastify.addContentTypeParser(
        'multipart/form-data',
        {},
        (req, body, done) => {
            done(null, req)
        }
    )
}
