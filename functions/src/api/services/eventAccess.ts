import { FastifyRequest } from 'fastify'
import { NotFoundError } from '../others/Errors'

export type EventAccess = { projectId: string } | { organizationId: string }

export const eventAccessFor = (request: FastifyRequest): EventAccess => {
    if (request.project) return { projectId: request.project.id }
    if (request.organization) return { organizationId: request.organization.id }
    throw new NotFoundError('Event not found')
}

/**
 * Request-only half of the event access rule: an event key only reaches its
 * own event. Call it before any read so a key for another event costs no
 * Firestore I/O and never touches that event's document.
 */
export const assertKeyScope = (projectId: string, access: EventAccess) => {
    if ('projectId' in access && access.projectId !== projectId) {
        throw new NotFoundError('Event not found')
    }
}

/**
 * Authorization rule for event-scoped reads and writes through
 * ProjectDao.updateProject and the talk and speaker DAOs: an event key only
 * reaches its own event, an organization key only events of that
 * organization. Run it on data read inside the transaction so moving or
 * deleting an event concurrently cannot authorize a write against stale data.
 * Access failures are the same 404 so event IDs stay non-enumerable.
 */
export function assertEventAccess<T extends { organizationId?: unknown }>(
    projectId: string,
    access: EventAccess,
    project: T | undefined
): asserts project is T {
    assertKeyScope(projectId, access)
    if (
        !project ||
        ('organizationId' in access &&
            project.organizationId !== access.organizationId)
    ) {
        throw new NotFoundError('Event not found')
    }
}
