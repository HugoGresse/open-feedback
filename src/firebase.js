import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import config from './config'

const firebaseMain = firebase.initializeApp(config.firebaseMain)

firebaseMain.firestore().settings({ timestampsInSnapshots: true })

export const authProvider = firebaseMain.auth()
export const fireStoreMainInstance = firebaseMain.firestore()
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export let fireStoreScheduleInstance

export const initFireStoreSchedule = config => {
    const firebaseSchedule = firebase.initializeApp(config, 'schedule')

    firebaseSchedule.firestore().settings({ timestampsInSnapshots: true })

    fireStoreScheduleInstance = firebaseSchedule.firestore()
}
