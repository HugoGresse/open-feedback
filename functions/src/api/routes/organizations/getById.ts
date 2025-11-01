import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { OrganizationSchema, ErrorSchema, IdSchema } from '../../schemas'

export const getOrganizationByIdRoute: FastifyPluginAsync = async (server) => {
    server.get(
        '/:id',
        {
            schema: {
                description: 'Get organization by ID',
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
            const { id } = request.params

            // TODO: Fetch organization from database
            // TODO: Check if user has access to this organization

            // Mock organization
            const organization = {
                id,
                name: 'OpenFeedback Demo',
                slug: 'openfeedback-demo',
                description: 'Demo organization for OpenFeedback',
                ownerId: 'demo-user-id',
                settings: {
                    allowPublicProjects: true,
                    requireApproval: false,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            return organization
        }
    )
}
