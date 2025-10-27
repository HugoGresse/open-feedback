import { onRequest } from 'firebase-functions/v2/https'
import { createApiServer } from '../api/api'

// Export the API as a Firebase HTTP function
export const api = onRequest(
    {
        region: 'us-central1',
        memory: '2GiB',
        timeoutSeconds: 300,
        cors: true,
        maxInstances: 10,
    },
    async (request, response) => {
        try {
            // Create and start the Fastify server
            const server = await createApiServer()

            // Use Fastify's built-in adapter for Firebase Functions
            await server.ready()
            server.server.emit('request', request, response)
        } catch (error) {
            console.error('API initialization error:', error)
            response.status(500).json({
                code: 'API_INITIALIZATION_ERROR',
                error: 'Internal Server Error',
                message: 'Failed to initialize API server',
                statusCode: 500,
            })
        }
    }
)
