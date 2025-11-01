import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { OrganizationSchema, ErrorSchema, IdSchema } from '../../schemas'
import { OrganizationDao } from '../../dao/OrganizationDao'
import { NotFoundError } from '../../others/Errors'

export const getOrganizationByIdRoute: FastifyPluginAsync = async (server) => {
    server.get(
        '/:id',
        {
            schema: {
                description:
                    'Get organizations a personal API Token can access',
                tags: ['Organizations'],
                params: Type.Object({
                    id: IdSchema,
                }),
                response: {
                    200: OrganizationSchema,
                    404: ErrorSchema,
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params as { id: string }

            try {
                const organization =
                    await OrganizationDao.getOrganizationFromId(
                        server.firebase,
                        id
                    )

                // TODO: Check if user has access to this organization

                const hydratedOrganization =
                    await OrganizationDao.hydrateOrganization(
                        server.firebase,
                        organization
                    )

                return hydratedOrganization
            } catch (error) {
                if (error instanceof NotFoundError) {
                    return reply.code(404).send({
                        error: 'Organization not found',
                        success: false,
                    })
                }
                throw error
            }
        }
    )
}
