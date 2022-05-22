import * as admin from 'firebase-admin'

export const initFirebase = () => {
    admin.initializeApp()
}

export const arrayUnion = admin.firestore.FieldValue.arrayUnion
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp
export const firestoreIncrement = admin.firestore.FieldValue.increment
