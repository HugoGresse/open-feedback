import type { AppThunk } from '../../../../store'
import type { Project } from '../../../../core/models'
import { initProjectApi } from '../../../../core/setupType/projectApi'
import { INIT_PROJECTAPI } from '../projectActionTypes'

export const initProjectApiIfReady =
    (
        projectId: string | null | undefined,
        project: Project | null | undefined
    ): AppThunk =>
    (dispatch) => {
        if (projectId && project && project.setupType) {
            initProjectApi(project.setupType, project)
            dispatch({
                type: INIT_PROJECTAPI,
            })
        }
    }
