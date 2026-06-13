import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mockFirebaseAdminApp } from '../../testUtils/firestoreMock'

describe('/organizations/me', () => {
    let fastify: any

    beforeEach(async () => {
        mockFirebaseAdminApp({})

        const { createFastifyAPI } = await import('../api')
        fastify = await createFastifyAPI()
    })

    afterEach(async () => {
        if (fastify) {
            await fastify.close()
        }
        vi.clearAllMocks()
    })

    describe('GET /fgnikjewfhgiewiufheuiwfhuiew', () => {
        it('should return bad request with an unknown API key type', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: `/fgnikjewfhgiewiufheuiwfhuiew`,
            })

            expect(response.statusCode).toBe(404)
            expect(response.headers['content-type']).toBe(
                'application/json; charset=utf-8'
            )

            const body = JSON.parse(response.body)
            expect(body).toEqual({
                error: 'Route not Found',
                success: false,
            })
        })
    })
    describe('GET Swagger UI doc ', () => {
        it('should return a HTML document when getting the API root', async () => {
            const response = await fastify.inject({
                method: 'GET',
                url: `/`,
            })

            expect(response.statusCode).toBe(200)
            expect(response.headers['content-type']).toBe(
                'text/html; charset=utf-8'
            )

            expect(response.body).toContain('"title": "OpenFeedback API"')
        })
    })
})
