import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mockFirebaseAdminApp } from '../../../testUtils/firestoreMock'
import { APIKey } from '../../plugins/APIKey'

describe('getOrganizationByApiKeyRoute Integration', () => {
    let fastify: any

    beforeEach(async () => {
        // Reset mocks
        vi.clearAllMocks()

        mockFirebaseAdminApp({
            organizations: [
                {
                    id: 'org_123',
                    name: 'Test Organization',
                    apiKey: 'org_test-key-123',
                },
            ],
        })

        const { createFastifyAPI } = await import('../../api')
        fastify = await createFastifyAPI()
    })

    afterEach(async () => {
        if (fastify) {
            await fastify.close()
        }
    })

    describe('GET /me with real API key plugin', () => {
        it('should return bad request with an unknown API key type', async () => {
            // Create a valid organization API key
            const apiKey = new APIKey('org_test-key-123')

            const response = await fastify.inject({
                method: 'GET',
                url: `/me?apiKey=${apiKey.apiKey}`,
            })

            expect(response.statusCode).toBe(400)
            expect(response.headers['content-type']).toBe(
                'application/json; charset=utf-8'
            )

            const body = JSON.parse(response.body)
            expect(body).toEqual({
                error: 'Unknown API key type!',
                success: false,
            })
        })
        it('should return a 404 because the organization was not found', async () => {
            // Create a valid organization API key
            const apiKey = new APIKey('oforg_unknown-key')

            const response = await fastify.inject({
                method: 'GET',
                url: `/me?apiKey=${apiKey.apiKey}`,
            })

            expect(response.statusCode).toBe(404)
            expect(response.headers['content-type']).toBe(
                'application/json; charset=utf-8'
            )

            const body = JSON.parse(response.body)
            expect(body).toEqual({
                error: 'Not Found',
                success: false,
            })
        })

        // it('should return 401 when API key is invalid', async () => {
        //     const response = await fastify.inject({
        //         method: 'GET',
        //         url: '/me?apiKey=invalid-key',
        //     })

        //     expect(response.statusCode).toBe(401)
        //     expect(response.headers['content-type']).toBe(
        //         'application/json; charset=utf-8'
        //     )

        //     const body = JSON.parse(response.body)
        //     expect(body).toEqual({
        //         error: 'Unauthorized! Du balai !',
        //         success: false,
        //     })
        // })

        // it('should return 401 when no API key is provided', async () => {
        //     const response = await fastify.inject({
        //         method: 'GET',
        //         url: '/me',
        //     })

        //     expect(response.statusCode).toBe(401)
        //     expect(response.headers['content-type']).toBe(
        //         'application/json; charset=utf-8'
        //     )

        //     const body = JSON.parse(response.body)
        //     expect(body).toEqual({
        //         error: 'Unauthorized! Du balai !',
        //         success: false,
        //     })
        // })

        // it('should return 400 when API key type is unknown', async () => {
        //     const response = await fastify.inject({
        //         method: 'GET',
        //         url: '/me?apiKey=unknown-type-key',
        //     })

        //     expect(response.statusCode).toBe(500) // BadRequestError becomes 500 in error handler
        // })

        // it('should handle project API key gracefully', async () => {
        //     // Create a project API key (this should not match organization API key logic)
        //     const projectApiKey = 'proj_test-key-123'

        //     const response = await fastify.inject({
        //         method: 'GET',
        //         url: `/me?apiKey=${projectApiKey}`,
        //     })

        //     // Should return 401 because project API key doesn't match organization logic
        //     expect(response.statusCode).toBe(401)
        // })
    })

    // describe('Error handling', () => {
    //     it('should handle database connection errors', async () => {
    //         // Make firestore throw on get()
    //         mockFirebase.__mocks.get.mockRejectedValueOnce(
    //             new Error('Database connection failed')
    //         )
    //         const response = await fastify.inject({
    //             method: 'GET',
    //             url: '/me?apiKey=org_test-key-123',
    //         })

    //         expect(response.statusCode).toBe(500)
    //     })

    //     it('should handle malformed API key', async () => {
    //         const response = await fastify.inject({
    //             method: 'GET',
    //             url: '/me?apiKey=malformed-key-without-prefix',
    //         })

    //         expect(response.statusCode).toBe(401)
    //     })
    // })

    // describe('Performance and edge cases', () => {
    //     it('should handle concurrent requests', async () => {
    //         const apiKey = new APIKey('org_test-key-123')
    //         const promises = Array.from({ length: 5 }, () =>
    //             fastify.inject({
    //                 method: 'GET',
    //                 url: `/me?apiKey=${apiKey.apiKey}`,
    //             })
    //         )

    //         const responses = await Promise.all(promises)

    //         responses.forEach((response) => {
    //             expect(response.statusCode).toBe(200)
    //             const body = JSON.parse(response.body)
    //             expect(body).toEqual(mockOrganization)
    //         })
    //     })

    //     it('should handle very long API keys', async () => {
    //         const longApiKey = 'org_' + 'a'.repeat(1000)

    //         const response = await fastify.inject({
    //             method: 'GET',
    //             url: `/me?apiKey=${longApiKey}`,
    //         })

    //         // Should handle gracefully (either 401 for invalid format or 404 for not found)
    //         expect([401, 404]).toContain(response.statusCode)
    //     })
    // })
})
