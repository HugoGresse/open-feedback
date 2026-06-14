import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mockFirebaseAdminApp } from '../../../testUtils/firestoreMock'
import { mockWhere } from 'firestore-vitest/mocks/firestore'

// The full project (event) doc as stored in Firestore. owner/members are
// internal user ids that must never be exposed through the API.
const baseProject = {
    id: 'proj_123',
    name: 'Test Event',
    owner: 'user_123',
    members: ['user_123', 'user_456'],
    organizationId: 'org_123',
}

// Stub the project-key resolution chain used by ProjectDao.getProjectFromApiKey:
// collectionGroup('private').where(...).limit(1).get(), whose matched doc's
// grandparent is the project doc.
const mockProjectKeyResolves = (project = baseProject) => {
    const projectDoc = {
        exists: true,
        id: project.id,
        data: () => project,
    }
    const projectRef = {
        id: project.id,
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
}

describe('/events/me', () => {
    let fastify: any

    beforeEach(async () => {
        mockFirebaseAdminApp({ projects: [], organizations: [], users: [] })
        const { createFastifyAPI } = await import('../../api')
        fastify = await createFastifyAPI()
    })

    afterEach(async () => {
        if (fastify) {
            await fastify.close()
        }
        vi.clearAllMocks()
    })

    it('should return 401 when no API key is provided', async () => {
        const response = await fastify.inject({
            method: 'GET',
            url: '/events/me',
        })

        expect(response.statusCode).toBe(401)
        expect(JSON.parse(response.body)).toEqual({
            error: 'Unauthorized! Du balai !',
            success: false,
        })
    })

    it('should return 401 when the event is not found', async () => {
        mockWhere.mockImplementation(() => ({
            limit: () => ({
                get: () => ({ empty: true, docs: [] }),
            }),
        }))

        const response = await fastify.inject({
            method: 'GET',
            url: '/events/me',
            headers: { 'x-api-key': 'ofproj_unknown-key' },
        })

        expect(response.statusCode).toBe(401)
        expect(JSON.parse(response.body)).toEqual({
            error: 'Unauthorized! Du balai !',
            success: false,
        })
    })

    it('should return only public event fields and never leak owner/members', async () => {
        mockProjectKeyResolves()

        const response = await fastify.inject({
            method: 'GET',
            url: '/events/me',
            headers: { 'x-api-key': 'ofproj_test-key-123' },
        })

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
            'application/json; charset=utf-8'
        )

        const body = JSON.parse(response.body)
        expect(body).toEqual({
            id: 'proj_123',
            name: 'Test Event',
            organizationId: 'org_123',
        })
        // Security: internal user ids must not be exposed.
        expect(body).not.toHaveProperty('owner')
        expect(body).not.toHaveProperty('members')
    })
})
