import {
    GET_PROJECT_SUCCESS,
    GET_PROJECTS_ERROR,
    GET_PROJECTS_SUCCESS,
    SELECT_PROJECT
} from './projectActionTypes'
import { LOGOUT } from '../../auth/authActionTypes'

const initState = {
    data: {
        projects: []
    },
    projectsLoaded: false,
    projectLoadError: null,
    projectVotesError: null,
    selectedProjectId: null
}

const projectReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case LOGOUT:
            return initState
        case GET_PROJECTS_SUCCESS:
            return {
                ...state,
                data: {
                    projects: payload
                },
                projectsLoaded: true
            }
        case GET_PROJECT_SUCCESS: {
            const newProjectsArray = Array.from(state.data.projects).filter(
                project => project.id !== payload.id
            )

            newProjectsArray.push(payload)

            return {
                ...state,
                data: {
                    ...state.data,
                    projects: newProjectsArray
                }
            }
        }
        case SELECT_PROJECT:
            return {
                ...state,
                selectedProjectId: payload
            }
        case GET_PROJECTS_ERROR:
            console.error(payload)
            return {
                ...state,
                projectLoadError: payload
            }
        default:
            return state
    }
}

export default projectReducer
