import firebase from 'firebase/compat/app'
import 'firebase/storage'

export const deleteImageIfPossible = (storageFullPath, docId) => {
    const refBase = firebase.storage().ref()
    const fileToDelete = storageFullPath.split(refBase.bucket)[1]
    const storageRef = firebase.storage().ref(fileToDelete)

    storageRef.delete().catch((error) => {
        // expected with emulators
        console.warn(error)
    })
}

export const deleteOldFilesIfNewValueDiffer =
    (oldObject, newObject, keyArray) => (dispatch, getState) => {
        if (
            !oldObject ||
            !newObject ||
            !keyArray ||
            Object.keys(oldObject).length <= 0 ||
            Object.keys(newObject) <= 0
        ) {
            return
        }

        keyArray.forEach((key) => {
            const oldValue = oldObject[key]
            const newValue = newObject[key]

            if (!oldValue || !newValue) {
                return
            }

            if (oldValue !== newValue) {
                try {
                    const path = new URL(oldObject[key]).pathname.slice(1)
                    deleteImageIfPossible(path)
                } catch (ignore) {
                    // ignored
                }
            }
        })
    }
