import firebase from 'firebase/app'
import 'firebase/firestore'
import config from './config'

const firebaseMain = firebase.initializeApp(config.firebaseMain)
const firebaseSchedule = firebase.initializeApp(
    config.firebaseSchedule,
    'schedule'
)
firebaseSchedule.firestore().settings({ timestampsInSnapshots: true })
firebaseMain.firestore().settings({ timestampsInSnapshots: true })

export const fireStoreMainInstance = firebaseSchedule.firestore()
export const fireStoreScheduleInstance = firebaseSchedule.firestore()
