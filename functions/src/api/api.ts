import { buildServer } from './server'
import { createConfig } from './config'

export async function createApiServer() {
    const config = createConfig()
    const server = await buildServer(config)

    return server
}

export { buildServer, createConfig }
export * from './schemas'
export * from './plugins/auth'
export * from './plugins/error-handler'
