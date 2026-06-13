import fastifyPlugin from 'fastify-plugin'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { Static, Type } from '@sinclair/typebox'
import {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} from '../others/Errors'
import { APIKey } from './APIKey'
import { OrganizationDao } from '../dao/OrganizationDao'
import { ProjectDao } from '../dao/ProjectDao'

export const authenticateRequest = async (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> => {
    const fastify = request.server

    // Get API key from header
    const apiKeyHeader = request.headers['x-api-key']
    const apiKeyParam =
        typeof apiKeyHeader === 'string' ? apiKeyHeader : apiKeyHeader?.[0]

    if (!apiKeyParam || apiKeyParam.length === 0) {
        throw new UnauthorizedError('Unauthorized! Du balai !')
    }

    try {
        const apiKey = new APIKey(apiKeyParam)

        if (apiKey.isOrganizationAPIKey()) {
            const organization =
                await OrganizationDao.getOrganizationFromApiKey(
                    fastify.firebase,
                    apiKey
                )
            request.setDecorator('organization', organization || undefined)
            return
        }
        if (apiKey.isProjectAPIKey()) {
            const project = await ProjectDao.getProjectFromApiKey(
                fastify.firebase,
                apiKey
            )
            request.setDecorator('project', project || undefined)
            return
        }
        throw new BadRequestError('Invalid API key')
    } catch (error) {
        if (error instanceof NotFoundError) {
            reply
                .code(401)
                .send({ error: 'Unauthorized! Du balai !', success: false })
            return
        }
        throw error
    }
}

export const Error400_401_VerifyRequest = Type.Object({
    success: Type.Boolean(),
    error: Type.String(),
})
export type Error400_401_VerifyRequestType = Static<
    typeof Error400_401_VerifyRequest
>

export const apiKeyPlugin = fastifyPlugin(
    (fastify: FastifyInstance, options: unknown, next: () => void) => {
        // Decorate request with organization and project properties
        fastify.decorateRequest('organization', null)
        fastify.decorateRequest('project', null)

        next()
    },
    {
        fastify: '>=3.x',
        name: 'apiKeyPlugin',
    }
)
