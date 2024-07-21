import { fireStoreMainInstance } from '../../../firebase.ts'

export const getNewProjectId = () => {
    return fireStoreMainInstance.collection('projects').doc().id
}

const reservedProjectIds = ['admin', 'l', 'contact', 'help', 'legal']

// Not using Thunks (dispatch, etc)
export const doesProjectIdExistOrIsAllowed = (projectId) => {
    if (reservedProjectIds.includes(projectId)) {
        return Promise.resolve(true)
    }

    return fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .get()
        .then((result) => result.exists)
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)
            return true
        })
}
