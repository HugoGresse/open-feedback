import * as admin from 'firebase-admin'
import serviceAccount from '../serviceAccountKey.json'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
})

export const firestore = admin.firestore()
