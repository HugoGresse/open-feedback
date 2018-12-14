import firebase from 'firebase/app'
import 'firebase/firestore'
import config from './config'

firebase.initializeApp(config.firebase)
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase