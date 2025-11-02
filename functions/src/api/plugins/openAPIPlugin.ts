import fastifyPlugin from 'fastify-plugin'
import swagger from '@fastify/swagger'
import { FastifyInstance } from 'fastify'
import { isNodeEnvDev, isNodeEnvTest } from '../env'
/**
 * This plugin adds Swagger documentation to the API
 */
export const openAPIPlugin = fastifyPlugin(async (fastify: FastifyInstance) => {
    console.log('isNodeEnvDev', isNodeEnvDev, isNodeEnvTest)
    await fastify.register(swagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'OpenFeedback API',
                description: 'API documentation for OpenFeedback',
                version: '1.0.0',
            },
            servers: [
                {
                    url: isNodeEnvDev
                        ? 'http://127.0.0.1:5001/open-feedback-42/us-central1/api/'
                        : 'https://api-open-feedback-42-ew.a.run.app/',
                    description: 'Local development',
                },
            ],
        },
    })

    await fastify.register(import('@scalar/fastify-api-reference'), {
        routePrefix: '/',
        configuration: {
            metaData: {
                title: 'OpenFeedback API',
            },
        },
    })
})
