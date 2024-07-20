/* eslint-disable no-console */
import { initializeApp, cert } from 'firebase-admin/app'

// service account credentials (need to be downloaded from firebase console)
import serviceAccount from '../serviceAccountKey.json'

console.log('Connecting to firestore...')

if (!serviceAccount) {
    console.error(
        'You need the service account credentials (need to be downloaded from firebase console)'
    )
    process.exit(1)
}

initializeApp({
    credential: cert(serviceAccount as any),
})

console.log('Connected.\n \n')
