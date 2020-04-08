import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../projectSelectors'
import { deleteField, fireStoreMainInstance } from '../../../../firebase'
import { addNotification } from '../../../notification/notifcationActions'
import { EDIT_PROJECT_ERROR, EDIT_PROJECT_SUCCESS } from '../projectActionTypes'
import { deleteOldFilesIfNewValueDiffer } from '../../utils/storage/deleteImageIfPossible'

export const editProject = (projectData) => (dispatch, getState) => {
    const currentProject = getSelectedProjectSelector(getState())
    if (
        !projectData.restrictVoteRange &&
        projectData.restrictVoteRange !== undefined
    ) {
        projectData.voteStartTime = deleteField()
        projectData.voteEndTime = deleteField()
    }
    delete projectData.restrictVoteRange

    return fireStoreMainInstance
        .collection('projects')
        .doc(getSelectedProjectIdSelector(getState()))
        .set(projectData, { merge: true })
        .then(() => {
            dispatch(
                addNotification({
                    type: 'success',
                    i18nkey: 'project.saveSuccess',
                })
            )

            dispatch({
                type: EDIT_PROJECT_SUCCESS,
                payload: projectData,
            })
            dispatch(
                deleteOldFilesIfNewValueDiffer(currentProject, projectData, [
                    'favicon',
                    'logoSmall',
                ])
            )
        })
        .catch((err) => {
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'project.saveFail',
                })
            )

            dispatch({
                type: EDIT_PROJECT_ERROR,
                payload: err.toString(),
            })
        })
}
