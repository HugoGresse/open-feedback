import 'firebase/storage'
import { functions } from '../../../../firebase'
import { getSelectedProjectIdSelector } from '../../core/projectSelectors'

export const deleteImageIfPossible = (storageFullPath, projectId) => {
    functions
        .removeFileFromStorage({
            storageFullPath,
            projectId,
        })
        .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error, error.message)
        })
}

export const deleteOldFilesIfNewValueDiffer = (
    oldObject,
    newObject,
    keyArray
) => (dispatch, getState) => {
    if (
        !oldObject ||
        !newObject ||
        !keyArray ||
        Object.keys(oldObject).length <= 0 ||
        Object.keys(newObject) <= 0
    ) {
        return
    }

    const projectId = getSelectedProjectIdSelector(getState())

    keyArray.forEach(key => {
        const oldValue = oldObject[key]
        const newValue = newObject[key]

        if (!oldValue || !newValue) {
            return
        }

        if (oldValue !== newValue) {
            try {
                const path = new URL(oldObject[key]).pathname.slice(1)
                deleteImageIfPossible(path, projectId)
            } catch (ignore) {
                // ignored
            }
        }
    })
}
