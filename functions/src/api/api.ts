import Fastify from 'fastify'
import { addContentTypeParserForServerless } from './addContentTypeParserForServerless'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { App as FirebaseApp } from 'firebase-admin/app'
import { apiKeyPlugin } from './plugins/apiKeyPlugin'
import { firebasePlugin } from './plugins/firebasePlugin'
import cors from '@fastify/cors'
import { swaggerPlugin } from './plugins/swaggerPlugin'
import { fastifyErrorHandler } from './others/fastifyErrorHandler'
import { fastifyNotFoundHandler } from './others/fastifyNotFoundHandler'
import { organizationsRoutes } from './routes/organizations'

type Firebase = FirebaseApp
declare module 'fastify' {
    interface FastifyInstance {
        firebase: Firebase
        authenticateRequest: (request: any, reply: any) => Promise<void>
    }
}

export async function createFastifyAPI() {
    const fastify = Fastify({
        logger: true, // always enable full log
    }).withTypeProvider<TypeBoxTypeProvider>()
    addContentTypeParserForServerless(fastify)

    fastify.setErrorHandler(fastifyErrorHandler)
    fastify.setNotFoundHandler(fastifyNotFoundHandler)

    fastify.register(firebasePlugin)
    fastify.register(apiKeyPlugin)
    fastify.register(cors, {
        origin: '*',
    })
    fastify.register(swaggerPlugin)

    fastify.addHook('onSend', (_, reply, _2, done: () => void) => {
        reply.header('Cache-Control', 'must-revalidate,no-cache,no-store')
        done()
    })

    fastify.register(organizationsRoutes, { prefix: '/organizations' })

    return fastify
}
