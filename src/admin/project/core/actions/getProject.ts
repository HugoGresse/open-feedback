import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import { doc, getDoc } from 'firebase/firestore'
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
        return getDoc(
            doc(
                fireStoreMainInstance,
                'projects',
                selectedProjectId ||
                    getSelectedProjectIdOrThrowSelector(getState())
            )
        )
            .then((snapshot) => {
                if (snapshot.exists()) {
                    // Firestore boundary
                    const project = {
                        id: snapshot.id,
                        ...snapshot.data(),
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
