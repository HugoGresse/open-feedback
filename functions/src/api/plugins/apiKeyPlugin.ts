import fastifyPlugin from 'fastify-plugin'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { FastifyAuthFunction } from '@fastify/auth'
import { Static, Type } from '@sinclair/typebox'
import {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} from '../others/Errors'
import { APIKey } from './APIKey'
import { OrganizationDao } from '../dao/OrganizationDao'
import { ProjectDao } from '../dao/ProjectDao'
import { Organization } from '../../types/Organization'
import { Project } from '../../types/Project'

const verifyRequest = async (
    fastify: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
): Promise<Organization | Project | null> => {
    // Get API key from query param or header
    // @ts-expect-error just dont careeee
    const apiKeyQuery = request.query?.apiKey
    const apiKeyParam = apiKeyQuery

    if (!apiKeyParam || apiKeyParam.length === 0) {
        throw new UnauthorizedError('Unauthorized! Du balai !')
    }

    try {
        const apiKey = new APIKey(apiKeyParam)

        if (apiKey.isOrganizationAPIKey()) {
            return await OrganizationDao.getOrganizationFromApiKey(
                fastify.firebase,
                apiKey
            )
        }
        if (apiKey.isProjectAPIKey()) {
            return await ProjectDao.getProjectFromApiKey(
                fastify.firebase,
                apiKey
            )
        }
        throw new BadRequestError('Unknown API key type!')
    } catch (error) {
        if (error instanceof NotFoundError) {
            reply
                .code(401)
                .send({ error: 'Unauthorized! Du balai !', success: false })
            return null
        }
        console.error('verifyRequest', error)
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
        fastify.decorate<FastifyAuthFunction>(
            'verifyApiKey',
            async (request: FastifyRequest, reply: FastifyReply) => {
                await verifyRequest(fastify, request, reply)
            }
        )
        next()
    },
    {
        fastify: '>=3.x',
        name: 'verifyApiKey', // this is used by fastify-plugin to derive the property name
    }
)
