import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/performance'
import 'firebase/functions'
import 'firebase/analytics'

export const isUsingEmulators = process.env.REACT_APP_EMULATORS === 'true'

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
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
    resizeAndMoveImage: firebase
        .functions()
        .httpsCallable('resizeAndMoveImage'),
    removeFileFromStorage: firebase
        .functions()
        .httpsCallable('removeFileFromStorage'),
}
export const HttpsFunctionsUrl = {
    sendContactEmail: isUsingEmulators
        ? `http://localhost:5001/${config.projectId}/us-central1/sendContactEmail`
        : `https://us-central1-${config.projectId}.cloudfunctions.net/sendContactEmail`,
}
authProvider.useDeviceLanguage()

if (process.env.NODE_ENV === 'production') {
    firebase.performance()
}
if (isUsingEmulators) {
    // eslint-disable-next-line no-console
    console.log('ℹ️ App is using Firebase Emulators')
    authProvider.useEmulator('http://localhost:9099')
    firebase.functions().useEmulator('localhost', 5001)
    // Fix issue with Cypress, see https://github.com/cypress-io/cypress/issues/6350#issuecomment-697122434
    fireStoreMainInstance.settings({
        experimentalForceLongPolling: true,
        host: 'localhost:8080',
        ssl: false,
    })
}
