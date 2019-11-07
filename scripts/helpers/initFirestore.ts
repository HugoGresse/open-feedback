/* eslint-disable no-console */
import * as admin from 'firebase-admin'

// service account credentials (need to be downloaded from firebase console)
import serviceAccount from '../serviceAccountKey.json'

console.log('Connecting to firestore...')

if (!serviceAccount) {
  console.error(
    'You need the service account credentials (need to be downloaded from firebase console)',
  )
  process.exit(1)
}

// initialize app credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
})

console.log('Connected.')
