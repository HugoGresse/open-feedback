import * as admin from 'firebase-admin'

export const initFirebase = (env: string) => {
    // eslint-disable-next-line no-undef
    const serviceAccount = require(
        env === 'development' ?
            '../../serviceAccountKey.development.json' :
            '../../serviceAccountKey.production.json')

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    })
}
