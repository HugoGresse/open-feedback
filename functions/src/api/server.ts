import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

import { authPlugin } from './plugins/auth'
import { errorHandler } from './plugins/error-handler'
import { apiRoutes } from './routes'
import { AppConfig } from './config'

export async function buildServer(config: AppConfig): Promise<FastifyInstance> {
    const server = Fastify({
        logger: {
            level: config.logLevel,
            transport: config.isDevelopment
                ? {
                      target: 'pino-pretty',
                      options: {
                          colorize: true,
                          translateTime: 'HH:MM:ss Z',
                          ignore: 'pid,hostname',
                      },
                  }
                : undefined,
        },
        ajv: {
            customOptions: {
                removeAdditional: 'all',
                coerceTypes: true,
                useDefaults: true,
            },
        },
    }).withTypeProvider<TypeBoxTypeProvider>()

    // Security plugins
    await server.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
    })

    await server.register(cors, {
        origin: config.allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })

    await server.register(rateLimit, {
        max: config.rateLimit.max,
        timeWindow: config.rateLimit.timeWindow,
        errorResponseBuilder: (request, context) => {
            return {
                code: 'RATE_LIMIT_EXCEEDED',
                error: 'Rate limit exceeded',
                message: `Too many requests. Try again in ${Math.round(context.ttl / 1000)} seconds.`,
                statusCode: 429,
            }
        },
    })

    // Swagger/OpenAPI documentation
    await server.register(swagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'OpenFeedback API',
                description:
                    'OpenFeedback API for managing events, talks, speakers, and feedback',
                version: '1.0.0',
                contact: {
                    name: 'OpenFeedback Team',
                    url: 'https://github.com/HugoGresse/open-feedback',
                },
                license: {
                    name: 'MIT',
                    url: 'https://github.com/HugoGresse/open-feedback/blob/main/LICENSE.md',
                },
            },
            servers: [
                {
                    url: config.apiBaseUrl,
                    description: 'OpenFeedback API',
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'JWT token for authentication',
                    },
                    apiKey: {
                        type: 'apiKey',
                        in: 'header',
                        name: 'X-API-Key',
                        description:
                            'API key for service-to-service authentication',
                    },
                },
            },
            security: [{ bearerAuth: [] }, { apiKey: [] }],
        },
        transform: ({ schema, url }) => {
            const transformedSchema = { ...schema }
            if (transformedSchema.hide) {
                delete transformedSchema.hide
            }
            return { schema: transformedSchema, url }
        },
    })

    if (config.isDevelopment) {
        await server.register(swaggerUI, {
            routePrefix: '/docs',
            uiConfig: {
                docExpansion: 'none',
                deepLinking: false,
            },
            staticCSP: true,
            transformStaticCSP: (header) => header,
        })
    }

    // Custom plugins
    await server.register(authPlugin, config.auth)
    await server.register(errorHandler)

    // Health check endpoint
    server.get(
        '/health',
        {
            schema: {
                description: 'Health check endpoint',
                tags: ['System'],
                response: {
                    200: Type.Object({
                        status: Type.Literal('ok'),
                        timestamp: Type.String({ format: 'date-time' }),
                        version: Type.String(),
                        environment: Type.String(),
                    }),
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            return {
                status: 'ok' as const,
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                environment: config.environment,
            }
        }
    )

    // API routes
    await server.register(apiRoutes, { prefix: '/api/v1' })

    // 404 handler
    server.setNotFoundHandler(
        {
            preHandler: server.rateLimit(),
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            reply.code(404).send({
                code: 'NOT_FOUND',
                error: 'Not Found',
                message: `Route ${request.method}:${request.url} not found`,
                statusCode: 404,
            })
        }
    )

    return server
}
