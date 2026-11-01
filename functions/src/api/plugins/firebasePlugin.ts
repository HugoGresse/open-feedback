import fp from 'fastify-plugin'
import {
    applicationDefault,
    cert,
    getApps,
    initializeApp,
} from 'firebase-admin/app'
import type { FastifyInstance } from 'fastify'

export function setupFirebase(
    fastify: FastifyInstance,
    _options: unknown,
    next: () => void
) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
        : undefined

    const appConfig = {
        credential: serviceAccount
            ? cert(serviceAccount)
            : applicationDefault(),
    }

    const existingApps = getApps()
    if (!existingApps[0]) {
        existingApps[0] = initializeApp(appConfig)
    }
    fastify.decorate('firebase', existingApps[0])
    next()
}

export const firebasePlugin = fp(setupFirebase, {
    fastify: '>=1.1.0',
    name: 'fastify-firebase',
})
