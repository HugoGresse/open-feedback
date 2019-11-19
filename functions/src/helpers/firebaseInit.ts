import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions';

// eslint-disable-next-line no-undef
const serviceAccount = require(
    functions.config().app.env === 'development' ?
        '../../serviceAccountKey.development.json' :
        '../../serviceAccountKey.production.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
})

export const firestore = admin.firestore()
