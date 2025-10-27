import Fastify from 'fastify'
import { addContentTypeParserForServerless } from './addContentTypeParserForServerless'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { fastifyAuth, FastifyAuthFunction } from '@fastify/auth'
import { app as firebaseApp } from 'firebase-admin'
import { apiKeyPlugin } from './plugins/apiKeyPlugin'
import { firebasePlugin } from './plugins/firebasePlugin'
import cors from '@fastify/cors'
import { swaggerPlugin } from './plugins/swaggerPlugin'
import { fastifyErrorHandler } from './others/fastifyErrorHandler'
import { fastifyNotFoundHandler } from './others/fastifyNotFoundHandler'

type Firebase = firebaseApp.App
declare module 'fastify' {
    interface FastifyInstance {
        firebase: Firebase
        verifyApiKey: FastifyAuthFunction
    }
}

export async function createFastifyAPI() {
    const fastify = Fastify({
        logger: true, // always enable full log
    }).withTypeProvider<TypeBoxTypeProvider>()
    addContentTypeParserForServerless(fastify)

    fastify.register(fastifyAuth)
    fastify.register(firebasePlugin)
    fastify.register(apiKeyPlugin)
    fastify.register(cors, {
        origin: '*',
    })
    fastify.register(swaggerPlugin)
    fastify.setErrorHandler(fastifyErrorHandler)
    fastify.setNotFoundHandler(fastifyNotFoundHandler)

    fastify.addHook('onSend', (_, reply, _2, done: () => void) => {
        reply.header('Cache-Control', 'must-revalidate,no-cache,no-store')
        done()
    })
    return fastify
}
