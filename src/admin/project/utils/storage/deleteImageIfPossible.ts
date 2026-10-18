import firebase from 'firebase/compat/app'
import 'firebase/storage'
import type { AppThunk } from '../../../../store'

export const deleteImageIfPossible = (storageFullPath: string) => {
    const refBase = firebase.storage().ref()
    const fileToDelete = storageFullPath.split(refBase.bucket)[1]
    const storageRef = firebase.storage().ref(fileToDelete)

    storageRef.delete().catch((error: unknown) => {
        // expected with emulators
        console.warn(error)
    })
}

export const deleteOldFilesIfNewValueDiffer =
    <K extends string>(
        oldObject: Partial<Record<K, unknown>> | null | undefined,
        newObject: Partial<Record<K, unknown>> | null | undefined,
        keyArray: K[]
    ): AppThunk =>
    () => {
        if (
            !oldObject ||
            !newObject ||
            !keyArray ||
            Object.keys(oldObject).length <= 0 ||
            // Was `Object.keys(newObject) <= 0` (array compared to a number).
            Object.keys(newObject).length <= 0
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
                    const path = new URL(String(oldValue)).pathname.slice(1)
                    deleteImageIfPossible(path)
                } catch {
                    // ignored
                }
            }
        })
    }
