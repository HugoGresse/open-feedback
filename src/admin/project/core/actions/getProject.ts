import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import {
    getSelectedProjectIdOrThrowSelector,
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../projectSelectors'
import {
    type AdminProject,
    GET_PROJECT_ERROR,
    GET_PROJECT_SUCCESS,
} from '../projectActionTypes'
import { addNotification } from '../../../notification/notifcationActions'
import { initProjectApiIfReady } from './initProjectApi'
import { getSelectedOrganizationSelector } from '../../../organization/core/organizationSelectors'
import { getOrganization } from '../../../organization/core/actions/getOrganization'
import { selectOrganization } from '../../../organization/core/actions/selectUnselectActions'

export const getProject =
    (
        selectedProjectId: string | null = null,
        initAPI?: boolean
    ): AppThunk<Promise<void>> =>
    (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(
                selectedProjectId ||
                    getSelectedProjectIdOrThrowSelector(getState())
            )
            .get()
            .then((doc) => {
                if (doc.exists) {
                    // Firestore boundary
                    const project = {
                        id: doc.id,
                        ...doc.data(),
                    } as AdminProject
                    if (
                        project.organizationId &&
                        !getSelectedOrganizationSelector(getState())
                    ) {
                        dispatch(selectOrganization(project.organizationId))
                        dispatch(getOrganization(project.organizationId))
                    }

                    dispatch({
                        type: GET_PROJECT_SUCCESS,
                        payload: project,
                    })
                } else {
                    dispatch({
                        type: GET_PROJECT_ERROR,
                        payload: 'Event does not exist',
                    })
                }
            })
            .then(() => {
                if (initAPI) {
                    const state = getState()
                    dispatch(
                        initProjectApiIfReady(
                            getSelectedProjectIdSelector(state),
                            getSelectedProjectSelector(state)
                        )
                    )
                }
            })
            .catch((err: unknown) => {
                dispatch({
                    type: GET_PROJECT_ERROR,
                    payload: String(err),
                })
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'project.errorLoad',
                    })
                )
            })
    }
