import { initProjectApi } from '../../../../core/setupType/projectApi'
import { INIT_PROJECTAPI } from '../projectActionTypes'

export const initProjectApiIfReady = (projectId, project) => (dispatch) => {
    if (projectId && project && project.setupType) {
        initProjectApi(project.setupType, project)
        dispatch({
            type: INIT_PROJECTAPI,
        })
    }
}
