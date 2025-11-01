import { Organization } from '../../types/Organization'
import { Project } from '../../types/Project'

declare module 'fastify' {
    interface FastifyRequest {
        organization?: Organization | null
        project?: Project | null
    }
}
