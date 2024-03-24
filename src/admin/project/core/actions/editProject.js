import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../projectSelectors'
import { deleteField, fireStoreMainInstance } from '../../../../firebase'
import { addNotification } from '../../../notification/notifcationActions'
import { EDIT_PROJECT_ERROR, EDIT_PROJECT_SUCCESS } from '../projectActionTypes'
import { deleteOldFilesIfNewValueDiffer } from '../../utils/storage/deleteImageIfPossible'
import { getSortedVoteItemsSelector } from '../../settings/votingForm/votingFormSelectors'
import { getVoteItems } from '../../settings/votingForm/votingFormActions.jsx'

export const editProject = (projectData) => (dispatch, getState) => {
    const currentProject = getSelectedProjectSelector(getState())

    dispatch(getVoteItems())
    const fixedProject = {
        ...fixProjectVoteRange(projectData),
        ...fixVoteItemLanguages(
            projectData.languages,
            getSortedVoteItemsSelector(getState())
        ),
    }

    return fireStoreMainInstance
        .collection('projects')
        .doc(getSelectedProjectIdSelector(getState()))
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
                payload: fixedProject,
            })
            dispatch(
                deleteOldFilesIfNewValueDiffer(currentProject, fixedProject, [
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

/**
 * Mutate project object base on vote range change. When restricted vote date are unselected from an event, we need to
 * remove the voteEndTime and voteStartTime from the DB.
 * @param project
 */
const fixProjectVoteRange = (project) => {
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

/**
 * We need to cleanup vote items when an additional language has been added, used and then removed from an event.
 *
 * @param languages project languages
 * @param voteItems vote items of a project
 * @returns {{voteItems: *}|{}}
 */
const fixVoteItemLanguages = (languages, voteItems) => {
    if (!languages || !voteItems || voteItems.length === 0) {
        return {}
    }

    const voteItemsLangs = [
        ...new Set(
            voteItems.reduce((acc, item) => {
                if (item.languages) {
                    return acc.concat(Object.keys(item.languages))
                }
                return acc
            }, [])
        ),
    ]
    const undesiredLangs = voteItemsLangs.filter(
        (lang) => !languages.includes(lang)
    )

    return {
        voteItems: voteItems.map((item) => {
            const cloneItem = { ...item }
            if (item.languages && Object.keys(item.languages > 0)) {
                undesiredLangs.forEach((undesiredLang) => {
                    delete cloneItem.languages[undesiredLang]
                })
            }
            return cloneItem
        }),
    }
}
