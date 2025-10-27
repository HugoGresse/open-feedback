import fp from 'fastify-plugin'
import fb, { credential } from 'firebase-admin'
import { FastifyInstance } from 'fastify'

export function setupFirebase(
    fastify: FastifyInstance,
    options: any,
    next: () => void
) {
    const cert = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
        : undefined

    const appConfig = {
        credential: cert
            ? credential.cert(cert)
            : fb.credential.applicationDefault(),
    }

    const firebaseApp = fb.initializeApp(appConfig)

    if (!fastify.firebase) {
        fastify.decorate('firebase', firebaseApp)
    }

    fastify.firebase = firebaseApp
    next()
}

export const firebasePlugin = fp(setupFirebase, {
    fastify: '>=1.1.0',
    name: 'fastify-firebase',
})
