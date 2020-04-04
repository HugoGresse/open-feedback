import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/performance'
import 'firebase/functions'
import 'firebase/analytics'

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
export const functions = {
    alert: firebase.functions().httpsCallable('alert'),
    deleteProject: firebase.functions().httpsCallable('deleteProject'),
    resizeAndMoveImage: firebase
        .functions()
        .httpsCallable('resizeAndMoveImage'),
}

if (process.env.NODE_ENV === 'production') {
    firebase.performance()
}

authProvider.useDeviceLanguage()
