import { onRequest } from 'firebase-functions/v2/https'
import { createFastifyAPI } from '../api/api'

// Build the Fastify app once per function instance and reuse it across
// invocations. Rebuilding it on every request re-registers all plugins/routes
// and re-runs ready(), which adds avoidable latency on warm instances.
let serverPromise: ReturnType<typeof createFastifyAPI> | null = null

const getServer = () => {
    if (!serverPromise) {
        serverPromise = createFastifyAPI().then(async (server) => {
            await server.ready()
            return server
        })
    }
    return serverPromise
}

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
            const server = await getServer()

            // Use Fastify's built-in adapter for Firebase Functions
            server.server.emit('request', request, response)
        } catch (error) {
            // Reset so the next request retries initialization.
            serverPromise = null
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
