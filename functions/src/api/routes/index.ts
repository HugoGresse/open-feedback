import { FastifyPluginAsync } from 'fastify'
import { authRoutes } from './auth'
import { organizationsRoutes } from './organizations'
import { projectsRoutes } from './projects'
import { usersRoutes } from './users'

export const apiRoutes: FastifyPluginAsync = async (server) => {
    // Authentication routes
    await server.register(authRoutes, { prefix: '/auth' })

    // User management routes
    await server.register(usersRoutes, { prefix: '/users' })

    // Organization routes
    await server.register(organizationsRoutes, { prefix: '/organizations' })

    // Project routes
    await server.register(projectsRoutes, { prefix: '/projects' })
}
