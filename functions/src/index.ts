import * as admin from 'firebase-admin'
import serviceAccount from '../serviceAccountKey.json'
import {ServiceAccount} from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: 'https://open-feedback-42.firebaseio.com'
})

const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })

export {aggregateVotesCreate, aggregateVotesDelete, aggregateVotesUpdate} from "./aggregateVotes"

