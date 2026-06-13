import type { Dispatch } from 'redux'
import { getSelectedProjectIdSelector } from '../projectSelectors'
import { deleteField, fireStoreMainInstance } from '../../../../firebase.ts'
import { addNotification } from '../../../notification/notifcationActions'
import { EDIT_PROJECT_ERROR, EDIT_PROJECT_SUCCESS } from '../projectActionTypes'
import { generateProjectApiKey } from '../../../../utils/generateProjectApiKey'

/**
 * Generate a brand new API key for the selected project (used both for the
 * initial "Generate" and for "Rotate"). Rotating invalidates the previous key,
 * so we also reset the last-used marker.
 */
export const updateProjectApiKey =
    () =>
    (dispatch: Dispatch, getState: () => unknown): Promise<string | void> => {
        const projectId = getSelectedProjectIdSelector(getState())
        const apiKey = generateProjectApiKey()

        return fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .set({ apiKey, apiKeyLastUsedAt: deleteField() }, { merge: true })
            .then(() => {
                dispatch(
                    addNotification({
                        type: 'success',
                        i18nkey: 'settingsIntegration.keyUpdated',
                    })
                )
                dispatch({
                    type: EDIT_PROJECT_SUCCESS,
                    payload: { apiKey, apiKeyLastUsedAt: null },
                })
                return apiKey
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
