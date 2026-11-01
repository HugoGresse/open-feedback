import { initializeApp } from 'firebase/app'
import {
    connectFirestoreEmulator,
    initializeFirestore,
} from 'firebase/firestore'
import {
    browserLocalPersistence,
    browserPopupRedirectResolver,
    browserSessionPersistence,
    connectAuthEmulator,
    debugErrorMap,
    indexedDBLocalPersistence,
    initializeAuth,
    useDeviceLanguage,
} from 'firebase/auth'
import { getPerformance } from 'firebase/performance'
import {
    connectFunctionsEmulator,
    getFunctions,
    httpsCallable,
} from 'firebase/functions'
import { getAnalytics } from 'firebase/analytics'

export const isUsingEmulators = import.meta.env.VITE_EMULATORS === 'true'

const config = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_DATABASE_URL,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    appId: import.meta.env.VITE_APPID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID,
}
export const firebaseApp = initializeApp(config)

// getAuth() setup, plus the full error messages the compat API installed
export const authProvider = initializeAuth(firebaseApp, {
    persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence,
    ],
    popupRedirectResolver: browserPopupRedirectResolver,
    errorMap: debugErrorMap,
})
export const fireStoreMainInstance = initializeFirestore(
    firebaseApp,
    // Fix issue with Cypress, see https://github.com/cypress-io/cypress/issues/6350#issuecomment-697122434
    isUsingEmulators ? { experimentalForceLongPolling: true } : {}
)
export const analytics = config.measurementId ? getAnalytics(firebaseApp) : null
const firebaseFunctions = getFunctions(firebaseApp)
export const functions = {
    alert: httpsCallable(firebaseFunctions, 'alert'),
    deleteProject: httpsCallable(firebaseFunctions, 'deleteProject'),
    deleteOrganization: httpsCallable(firebaseFunctions, 'deleteOrganization'),
}
export const HttpsFunctionsUrl = {
    sendContactEmail: isUsingEmulators
        ? `http://127.0.0.1:5001/${config.projectId}/us-central1/sendContactEmail`
        : `https://us-central1-${config.projectId}.cloudfunctions.net/sendContactEmail`,
}
useDeviceLanguage(authProvider)

if (import.meta.env.PROD) {
    getPerformance(firebaseApp)
}
if (isUsingEmulators) {
    // biome-ignore lint/suspicious/noConsole: intentional log
    console.log('ℹ️ App is using Firebase Emulators')
    connectAuthEmulator(authProvider, 'http://127.0.0.1:9099')
    connectFunctionsEmulator(firebaseFunctions, '127.0.0.1', 5001)
    connectFirestoreEmulator(fireStoreMainInstance, '127.0.0.1', 8080)
}
