import { deleteObject, ref } from 'firebase/storage'
import { storage } from './firebaseStorage.ts'
import type { AppThunk } from '../../../../store'

export const deleteImageIfPossible = (storageFullPath: string) => {
    const refBase = ref(storage)
    const fileToDelete = storageFullPath.split(refBase.bucket)[1]
    const storageRef = ref(storage, fileToDelete)

    deleteObject(storageRef).catch((error: unknown) => {
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
