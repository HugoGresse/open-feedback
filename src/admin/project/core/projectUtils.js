import { fireStoreMainInstance } from '../../../firebase'

export const getNewProjectId = () => {
    return fireStoreMainInstance.collection('projects').doc().id
}

// Not using Thunks (dispatch, etc)
export const doesProjectExist = (projectId) => {
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
