import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/performance'
import 'firebase/compat/functions'
import 'firebase/compat/analytics'
import 'firebase/compat/storage'

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
const firebaseMain = firebase.initializeApp(config)

export const auth = firebase.auth
export const authProvider = firebaseMain.auth()
export const fireStoreMainInstance = firebaseMain.firestore()
export const analytics = config.measurementId ? firebaseMain.analytics() : null
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export const nowTimestamp = firebase.firestore.Timestamp.now
export const deleteField = firebase.firestore.FieldValue.delete
export const arrayRemoveField = firebase.firestore.FieldValue.arrayRemove
export const arrayUnionField = firebase.firestore.FieldValue.arrayUnion
export const functions = {
    alert: firebase.functions().httpsCallable('alert'),
    deleteProject: firebase.functions().httpsCallable('deleteProject'),
}
export const HttpsFunctionsUrl = {
    sendContactEmail: isUsingEmulators
        ? `http://127.0.0.1:5001/${config.projectId}/us-central1/sendContactEmail`
        : `https://us-central1-${config.projectId}.cloudfunctions.net/sendContactEmail`,
}
authProvider.useDeviceLanguage()

if (process.env.NODE_ENV === 'production') {
    firebase.performance()
}
if (isUsingEmulators) {
    // eslint-disable-next-line no-console
    console.log('ℹ️ App is using Firebase Emulators')
    authProvider.useEmulator('http://127.0.0.1:9099')
    firebase.storage().useEmulator('127.0.0.1', 9199)
    firebase.functions().useEmulator('127.0.0.1', 5001)
    // Fix issue with Cypress, see https://github.com/cypress-io/cypress/issues/6350#issuecomment-697122434
    fireStoreMainInstance.settings({
        experimentalForceLongPolling: true,
        host: '127.0.0.1:8080',
        ssl: false,
    })
}

export const getStoragePublicPath = async (
    snapshotRef: firebase.storage.Reference
) => {
    if (isUsingEmulators) {
        return await snapshotRef.getDownloadURL()
    }
    const bucket = snapshotRef.bucket
    const path = snapshotRef.fullPath
    return `https://storage.googleapis.com/${bucket}/${path}`
}
