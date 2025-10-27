import fastifyPlugin from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { FastifyInstance } from 'fastify'
import { isNodeEnvDev } from '../env'
/**
 * This plugin adds Swagger documentation to the API
 */
export const swaggerPlugin = fastifyPlugin(async (fastify: FastifyInstance) => {
    await fastify.register(swagger, {
        swagger: {
            info: {
                title: 'OpenFeedback API',
                description: 'API documentation for OpenFeedback',
                version: '1.0.0',
            },
            host: isNodeEnvDev
                ? '127.0.0.1:5001/open-feedback-42/europe-west1/api/'
                : 'api-open-feedback-42-ew.a.run.app/',
            schemes: [isNodeEnvDev ? 'http' : 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
        },
    })

    await fastify.register(swaggerUi, {
        routePrefix: '/',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
            tryItOutEnabled: true,
        },
    })
})
