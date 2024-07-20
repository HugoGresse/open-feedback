import { initializeApp } from 'firebase-admin/app'
import { FieldValue } from 'firebase-admin/firestore'

export const initFirebase = () => {
    initializeApp()
}

export const arrayUnion = FieldValue.arrayUnion
export const serverTimestamp = FieldValue.serverTimestamp
export const firestoreIncrement = FieldValue.increment
