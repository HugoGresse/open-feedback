import { fireStoreMainInstance } from '../../../firebase.ts'
import { collection, doc, getDoc } from 'firebase/firestore'

export const getNewProjectId = () => {
    return doc(collection(fireStoreMainInstance, 'projects')).id
}

const reservedProjectIds = ['admin', 'l', 'contact', 'help', 'legal']

// Not using Thunks (dispatch, etc)
export const doesProjectIdExistOrIsAllowed = (
    projectId: string
): Promise<boolean> => {
    if (reservedProjectIds.includes(projectId)) {
        return Promise.resolve(true)
    }

    return getDoc(doc(fireStoreMainInstance, 'projects', projectId))
        .then((result) => result.exists())
        .catch((error) => {
            // biome-ignore lint/suspicious/noConsole: intentional log
            console.error(error)
            return true
        })
}
