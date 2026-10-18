import type { AppThunk } from '../../../../store'
import type { Project } from '../../../../core/models'
import {
    getSelectedProjectIdOrThrowSelector,
    getSelectedProjectSelector,
} from '../projectSelectors'
import { deleteField, fireStoreMainInstance } from '../../../../firebase.ts'
import { fixVoteItemLanguages } from './fixVoteItemLanguages'
import { addNotification } from '../../../notification/notifcationActions'
import {
    EDIT_PROJECT_ERROR,
    EDIT_PROJECT_SUCCESS,
    type ProjectEditData,
} from '../projectActionTypes'
import { deleteOldFilesIfNewValueDiffer } from '../../utils/storage/deleteImageIfPossible'
import { getSortedVoteItemsSelector } from '../../settings/votingForm/votingFormSelectors'
import { getVoteItems } from '../../settings/votingForm/votingFormActions.tsx'

export const editProject =
    (projectData: Partial<Omit<Project, 'id'>>): AppThunk<Promise<void>> =>
    (dispatch, getState) => {
        const currentProject = getSelectedProjectSelector(getState())

        dispatch(getVoteItems())
        const fixedProject: ProjectEditData = {
            ...fixProjectVoteRange(projectData),
            ...fixVoteItemLanguages(
                projectData.languages,
                getSortedVoteItemsSelector(getState())
            ),
        }

        return fireStoreMainInstance
            .collection('projects')
            .doc(getSelectedProjectIdOrThrowSelector(getState()))
            .set(fixedProject, { merge: true })
            .then(() => {
                dispatch(
                    addNotification({
                        type: 'success',
                        i18nkey: 'project.saveSuccess',
                    })
                )

                dispatch({
                    type: EDIT_PROJECT_SUCCESS,
                    // The store keeps what was written, Firestore sentinels
                    // (deleteField() of the vote range) included, as before.
                    payload: fixedProject as Partial<Project>,
                })
                dispatch(
                    deleteOldFilesIfNewValueDiffer(
                        currentProject,
                        fixedProject,
                        ['favicon', 'logoSmall']
                    )
                )
            })
            .catch((err: unknown) => {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'project.saveFail',
                    })
                )

                dispatch({
                    type: EDIT_PROJECT_ERROR,
                    payload: String(err),
                })
            })
    }

/**
 * Mutate project object base on vote range change. When restricted vote date are unselected from an event, we need to
 * remove the voteEndTime and voteStartTime from the DB.
 * @param project
 */
const fixProjectVoteRange = (project: ProjectEditData): ProjectEditData => {
    const editedValues = {
        ...project,
    }
    if (
        !editedValues.restrictVoteRange &&
        editedValues.restrictVoteRange !== undefined
    ) {
        editedValues.voteStartTime = deleteField()
        editedValues.voteEndTime = deleteField()
    }
    delete editedValues.restrictVoteRange
    return editedValues
}
