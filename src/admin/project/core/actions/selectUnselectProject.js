import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../projectSelectors'
import { CLEAR_TALK_VOTES } from '../../dashboard/dashboardActionTypes'
import { SELECT_PROJECT } from '../projectActionTypes'
import { initProjectApiIfReady } from './initProjectApi'
import {
    selectOrganization,
    unselectOrganization,
} from '../../../organization/core/actions/selectUnselectActions'

export const unselectProject = () => (dispatch, getState) => {
    const projectId = getSelectedProjectIdSelector(getState())

    if (!projectId) {
        return Promise.resolve()
    }

    dispatch({
        type: CLEAR_TALK_VOTES,
        payload: projectId,
    })
    dispatch({
        type: SELECT_PROJECT,
        payload: null,
    })
    dispatch(unselectOrganization())

    return Promise.resolve()
}
export const selectProject = (projectId) => (dispatch, getState) => {
    const currentSelectedProjectId = getSelectedProjectIdSelector(getState())
    if (currentSelectedProjectId === projectId) {
        // Project already selected (HMR potentially)
        return Promise.resolve(true)
    }

    dispatch({
        type: SELECT_PROJECT,
        payload: projectId,
    })

    const selectedProject = getSelectedProjectSelector(getState())

    if (selectedProject && selectedProject.organizationId) {
        dispatch(selectOrganization(selectedProject.organizationId))
    }

    dispatch(initProjectApiIfReady(projectId, selectedProject))

    return Promise.resolve(false)
}
