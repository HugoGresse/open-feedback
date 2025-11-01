#!/usr/bin/env node

/**
 * Standalone server for local development
 * Run with: npm run dev:api
 */

import { createFastifyAPI } from './api'

async function start() {
    try {
        const server = await createFastifyAPI()

        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
        const host = process.env.HOST || '0.0.0.0'

        await server.listen({ port, host })

        console.log(
            `🚀 OpenFeedback API Server running at http://${host}:${port}`
        )
        console.log(
            `📚 API Documentation available at http://${host}:${port}/docs`
        )
        console.log(`❤️  Health check at http://${host}:${port}/health`)

        // Graceful shutdown
        const signals = ['SIGINT', 'SIGTERM']
        signals.forEach((signal) => {
            process.on(signal, async () => {
                console.log(
                    `\n🛑 Received ${signal}, shutting down gracefully...`
                )
                try {
                    await server.close()
                    console.log('✅ Server closed successfully')
                    process.exit(0)
                } catch (error) {
                    console.error('❌ Error during shutdown:', error)
                    process.exit(1)
                }
            })
        })
    } catch (error) {
        console.error('❌ Failed to start server:', error)
        process.exit(1)
    }
}

// Only run if this file is executed directly
if (require.main === module) {
    start()
}

export { start }
