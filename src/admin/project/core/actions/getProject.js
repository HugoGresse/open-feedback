import { fireStoreMainInstance } from '../../../../firebase'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../projectSelectors'
import { GET_PROJECT_ERROR, GET_PROJECT_SUCCESS } from '../projectActionTypes'
import { addNotification } from '../../../notification/notifcationActions'
import { initProjectApiIfReady } from './initProjectApi'
import { getSelectedOrganizationSelector } from '../../../organization/core/organizationSelectors'
import { getOrganization } from '../../../organization/core/actions/getOrganization'
import { selectOrganization } from '../../../organization/core/actions/selectUnselectActions'

export const getProject = (selectedProjectId = null, initAPI) => (
    dispatch,
    getState
) => {
    return fireStoreMainInstance
        .collection('projects')
        .doc(selectedProjectId || getSelectedProjectIdSelector(getState()))
        .get()
        .then((doc) => {
            if (doc.exists) {
                const project = {
                    id: doc.id,
                    ...doc.data(),
                }
                if (
                    project.organizationId &&
                    !getSelectedOrganizationSelector(getState())
                ) {
                    dispatch(selectOrganization(project.organizationId))
                    dispatch(getOrganization(project.organizationId))
                }

                return dispatch({
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
        .catch((err) => {
            dispatch({
                type: GET_PROJECT_ERROR,
                payload: err.toString(),
            })
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'project.errorLoad',
                })
            )
        })
}
