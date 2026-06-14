import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import Fastify from 'fastify'
import { mockFirebaseAdminApp } from '../../testUtils/firestoreMock'
import { mockWhere } from 'firestore-vitest/mocks/firestore'

// Regression test for the Copilot review claim that `request.setDecorator(...)`
// "is not a FastifyRequest API and will throw at runtime". Fastify >= 5.1
// ships request.setDecorator, so the auth preHandler must populate
// request.organization / request.project for valid keys without throwing.
const buildApp = async () => {
    const { firebasePlugin } = await import('./firebasePlugin')
    const { apiKeyPlugin, authenticateRequest } = await import('./apiKeyPlugin')

    const fastify = Fastify()
    fastify.register(firebasePlugin)
    fastify.register(apiKeyPlugin)
    fastify.get(
        '/whoami',
        { preHandler: authenticateRequest },
        async (request) => ({
            organizationId: request.organization?.id ?? null,
            projectId: request.project?.id ?? null,
        })
    )
    await fastify.ready()
    return fastify
}

describe('authenticateRequest setDecorator', () => {
    let fastify: any

    beforeEach(() => {
        mockFirebaseAdminApp({ organizations: [], users: [] })
    })

    afterEach(async () => {
        if (fastify) {
            await fastify.close()
        }
        vi.clearAllMocks()
    })

    it('sets request.organization for a valid organization key (does not throw)', async () => {
        // The org key is resolved via
        // collectionGroup('private').where(...).limit(1).get(); the matched
        // doc's grandparent is the organization. Stub the chain + path guard.
        const organizationDoc = {
            exists: true,
            id: 'org_123',
            data: () => ({ id: 'org_123' }),
        }
        const organizationRef = {
            id: 'org_123',
            parent: { id: 'organizations' },
            get: () => organizationDoc,
        }
        const integrationDoc = {
            ref: {
                id: 'integration',
                parent: { parent: organizationRef },
                set: () => Promise.resolve(),
            },
        }
        mockWhere.mockImplementation(() => ({
            limit: () => ({
                get: () => ({ empty: false, docs: [integrationDoc] }),
            }),
        }))
        fastify = await buildApp()

        const response = await fastify.inject({
            method: 'GET',
            url: '/whoami',
            headers: { 'x-api-key': 'oforg_valid-key' },
        })

        expect(response.statusCode).toBe(200)
        expect(JSON.parse(response.body)).toEqual({
            organizationId: 'org_123',
            projectId: null,
        })
    })

    it('sets request.project for a valid project key (does not throw)', async () => {
        // The project key is resolved via
        // collectionGroup('private').where(...).limit(1).get(); the matched
        // doc's grandparent is the project. Stub the where->limit->get chain.
        const projectDoc = {
            exists: true,
            id: 'proj_123',
            data: () => ({ id: 'proj_123' }),
        }
        // projects/{projectId}/private/integration: the ref must look like a
        // real project-owned doc to pass the path guard.
        const projectRef = {
            id: 'proj_123',
            parent: { id: 'projects' },
            get: () => projectDoc,
        }
        const integrationDoc = {
            ref: {
                id: 'integration',
                parent: { parent: projectRef },
                set: () => Promise.resolve(),
            },
        }
        mockWhere.mockImplementation(() => ({
            limit: () => ({
                get: () => ({ empty: false, docs: [integrationDoc] }),
            }),
        }))
        fastify = await buildApp()

        const response = await fastify.inject({
            method: 'GET',
            url: '/whoami',
            headers: { 'x-api-key': 'ofproj_valid-key' },
        })

        expect(response.statusCode).toBe(200)
        expect(JSON.parse(response.body)).toEqual({
            organizationId: null,
            projectId: 'proj_123',
        })
    })
})
