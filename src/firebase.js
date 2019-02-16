import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import config from './config'

const firebaseMain = firebase.initializeApp(config.firebaseMain)

export const authProvider = firebaseMain.auth()
export const fireStoreMainInstance = firebaseMain.firestore()
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export let fireStoreScheduleInstance

export const initFireStoreSchedule = config => {
    if (firebase.apps.length >= 2) {
        return
    }

    const firebaseSchedule = firebase.initializeApp(config, 'schedule')
    fireStoreScheduleInstance = firebaseSchedule.firestore()
}
