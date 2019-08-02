import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import config from './config'

const firebaseMain = firebase.initializeApp(config.firebaseMain)

export const auth = firebase.auth
export const authProvider = firebaseMain.auth()
export const fireStoreMainInstance = firebaseMain.firestore()
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export const nowTimestamp = firebase.firestore.Timestamp.now

authProvider.useDeviceLanguage()

export const initFireStoreSchedule = config => {
    if (firebase.apps.filter(app => app.name === config.projectId).length > 0) {
        return
    }

    firebase.initializeApp(config, config.projectId)
}

export const getFirestoreSchedule = projectId => {
    return firebase.app(projectId).firestore()
}
