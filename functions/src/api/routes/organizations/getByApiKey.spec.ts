import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mockFirebaseAdminApp } from '../../../testUtils/firestoreMock'
import { OrganizationDBEntity } from '../../../types/Organization'
import { mockWhere } from 'firestore-vitest/mocks/firestore'

const baseOrganization = {
    id: 'org_123',
    name: 'Test Organization',
    favicon: 'https://example.com/favicon.ico',
    logoSmall: 'https://example.com/logo-small.png',
    languages: [],
    ownerUserId: 'user_123',
    adminUserIds: ['user_123'],
    editorUserIds: ['user_123'],
    viewerUserIds: ['user_123'],
    disableSoloTalkRedirect: false,
    hideVotesUntilUserVote: false,
    chipColors: ['#000000'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

const baseUser = {
    id: 'user_123',
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: 'https://example.com/photo.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

const mockOrganization = (
    organization?: Partial<OrganizationDBEntity>,
    users?: any[]
) => {
    const org = {
        ...baseOrganization,
        ...organization,
    }

    mockFirebaseAdminApp({
        organizations: [org],
        users: users || [baseUser],
    })
}

// Stub the org-key resolution chain used by
// OrganizationDao.getOrganizationFromApiKey:
// collectionGroup('private').where(...).limit(1).get(), whose matched doc's
// grandparent is the organization doc.
const mockOrgKeyResolves = (
    org: Record<string, unknown> = baseOrganization
) => {
    const organizationDoc = {
        exists: true,
        id: org.id as string,
        data: () => org,
    }
    const organizationRef = {
        id: org.id as string,
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
}

describe('/organizations/me', () => {
    let fastify: any

    beforeEach(async () => {
        mockOrganization()
        const { createFastifyAPI } = await import('../../api')
        fastify = await createFastifyAPI()
    })

    afterEach(async () => {
        if (fastify) {
            await fastify.close()
        }
        vi.clearAllMocks()
    })

    it('should return bad request with an unknown API key type', async () => {
        const response = await fastify.inject({
            method: 'GET',
            url: `/organizations/me`,
            headers: {
                'x-api-key': 'org_test-key-123',
            },
        })

        expect(response.statusCode).toBe(400)
        const body = JSON.parse(response.body)
        expect(body).toEqual({
            error: 'Invalid API key',
            success: false,
        })
    })

    it('should return a 401 because the organization was not found', async () => {
        mockWhere.mockImplementation(() => ({
            limit: () => ({
                get: () => ({ empty: true, docs: [] }),
            }),
        }))

        const response = await fastify.inject({
            method: 'GET',
            url: `/organizations/me`,
            headers: {
                'x-api-key': 'oforg_unknown-key',
            },
        })

        expect(mockWhere).toHaveBeenCalledWith(
            'apiKey',
            '==',
            'oforg_unknown-key'
        )
        expect(response.statusCode).toBe(401)
        expect(JSON.parse(response.body)).toEqual({
            error: 'Unauthorized! Du balai !',
            success: false,
        })
    })

    it('should return 401 when no API key is provided', async () => {
        const response = await fastify.inject({
            method: 'GET',
            url: '/organizations/me',
        })

        expect(response.statusCode).toBe(401)
        expect(JSON.parse(response.body)).toEqual({
            error: 'Unauthorized! Du balai !',
            success: false,
        })
    })

    it('should return 200 with hydrated organization data', async () => {
        mockOrgKeyResolves()

        const response = await fastify.inject({
            method: 'GET',
            url: `/organizations/me`,
            headers: {
                'x-api-key': 'oforg_test-key-123',
            },
        })

        expect(response.statusCode).toBe(200)
        const body = JSON.parse(response.body)

        // Verify hydrated user structure
        expect(body).toHaveProperty('ownerUser')
        expect(body).toHaveProperty('adminUsers')
        expect(body).toHaveProperty('editorUsers')
        expect(body).toHaveProperty('viewerUsers')

        // Verify user IDs are replaced with user objects
        expect(body).not.toHaveProperty('ownerUserId')
        expect(body).not.toHaveProperty('adminUserIds')
        expect(body).not.toHaveProperty('editorUserIds')
        expect(body).not.toHaveProperty('viewerUserIds')

        // The raw apiKey must never be serialized to the response.
        expect(body).not.toHaveProperty('apiKey')

        expect(body.ownerUser).toEqual({
            id: 'user_123',
            displayName: 'Test User',
            email: 'test@example.com',
            photoUrl: 'https://example.com/photo.jpg',
            createdAt: baseUser.createdAt,
            updatedAt: baseUser.updatedAt,
        })

        expect(body.adminUsers).toHaveLength(1)
        expect(body.editorUsers).toHaveLength(1)
        expect(body.viewerUsers).toHaveLength(1)

        expect(body.id).toBe('org_123')
        expect(body.name).toBe('Test Organization')
    })

    it('should handle missing users gracefully', async () => {
        mockOrganization(
            {
                ownerUserId: 'user_missing',
                adminUserIds: ['user_missing'],
                editorUserIds: [],
                viewerUserIds: [],
            },
            [] // No users in database
        )
        mockOrgKeyResolves({
            ...baseOrganization,
            ownerUserId: 'user_missing',
            adminUserIds: ['user_missing'],
            editorUserIds: [],
            viewerUserIds: [],
        })

        const response = await fastify.inject({
            method: 'GET',
            url: `/organizations/me`,
            headers: {
                'x-api-key': 'oforg_test-key-123',
            },
        })

        expect(response.statusCode).toBe(200)
        const body = JSON.parse(response.body)

        expect(body.ownerUser).toHaveProperty('id', 'user_missing')
        expect(body.ownerUser).not.toHaveProperty('displayName')
        expect(body.adminUsers).toHaveLength(1)
        expect(body.adminUsers[0].id).toBe('user_missing')
        expect(body.editorUsers).toHaveLength(0)
        expect(body.viewerUsers).toHaveLength(0)
    })
})
