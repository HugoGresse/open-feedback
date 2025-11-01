import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mockFirebaseAdminApp } from '../../../testUtils/firestoreMock'
import { OrganizationDBEntity } from '../../../types/Organization'
import { mockWhere } from 'firestore-vitest/mocks/firestore'

const baseOrganization = {
    id: 'org_123',
    name: 'Test Organization',
    apiKey: 'oforg_test-key-123',
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

const mockOrganization = (organization?: Partial<OrganizationDBEntity>) => {
    const org = {
        ...baseOrganization,

        ...organization,
    }

    mockFirebaseAdminApp({
        organizations: [org],
    })
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

    describe('GET /organizations/me', () => {
        it('should return bad request with an unknown API key type', async () => {
            mockOrganization({
                apiKey: 'org_test-key-123',
            })
            const response = await fastify.inject({
                method: 'GET',
                url: `/me?apiKey='org_test-key-123'`,
            })

            expect(response.statusCode).toBe(400)
            expect(response.headers['content-type']).toBe(
                'application/json; charset=utf-8'
            )

            const body = JSON.parse(response.body)
            expect(body).toEqual({
                error: 'Invalid API key',
                success: false,
            })
        })

        it('should return a 401 because the organization was not found', async () => {
            mockWhere.mockImplementation(() => ({
                get: () => ({
                    empty: true,
                    docs: [],
                }),
            }))

            const response = await fastify.inject({
                method: 'GET',
                url: `/organizations/me?apiKey=oforg_unknown-key`,
            })

            expect(mockWhere).toHaveBeenCalledWith(
                'apiKey',
                '==',
                'oforg_unknown-key'
            )

            expect(response.statusCode).toBe(401)
            expect(response.headers['content-type']).toBe(
                'application/json; charset=utf-8'
            )

            const body = JSON.parse(response.body)
            expect(body).toEqual({
                error: 'Unauthorized! Du balai !',
                success: false,
            })
        })

        it('should return 401 when no API key is provided', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: '/me',
            })

            expect(response.statusCode).toBe(401)
            expect(response.headers['content-type']).toBe(
                'application/json; charset=utf-8'
            )

            const body = JSON.parse(response.body)
            expect(body).toEqual({
                error: 'Unauthorized! Du balai !',
                success: false,
            })
        })

        it('should return 200 organization API key gracefully', async () => {
            mockWhere.mockImplementation(() => ({
                get: () => ({
                    empty: false,
                    docs: [
                        {
                            id: 'org_123',
                            data: () => baseOrganization,
                        },
                    ],
                }),
            }))

            const response = await fastify.inject({
                method: 'GET',
                url: `organizations/me?apiKey=oforg_test-key-123`,
            })

            // Should return 200 because organization API key matches organization logic
            expect(response.statusCode).toBe(200)
        })
    })
})
