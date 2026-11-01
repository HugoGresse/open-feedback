import {
    connectStorageEmulator,
    getDownloadURL,
    getStorage,
    type StorageReference,
} from 'firebase/storage'
import { firebaseApp, isUsingEmulators } from '../../../../firebase.ts'

// Only the admin uploads images: kept out of src/firebase.ts so that the
// feedback app does not load Storage.
export const storage = getStorage(firebaseApp)

if (isUsingEmulators) {
    connectStorageEmulator(storage, '127.0.0.1', 9199)
}

export const getStoragePublicPath = async (snapshotRef: StorageReference) => {
    if (isUsingEmulators) {
        return await getDownloadURL(snapshotRef)
    }
    const bucket = snapshotRef.bucket
    const path = snapshotRef.fullPath
    return `https://storage.googleapis.com/${bucket}/${path}`
}
