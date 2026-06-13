import fp from 'fastify-plugin'
import {
    applicationDefault,
    cert,
    getApps,
    initializeApp,
} from 'firebase-admin/app'
import { FastifyInstance } from 'fastify'

export function setupFirebase(
    fastify: FastifyInstance,
    options: any,
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

    let existingApps = getApps()
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
