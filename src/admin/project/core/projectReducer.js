import {
    ADD_PROJECT_ONGOING,
    EDIT_PROJECT_SUCCESS,
    GET_PROJECT_SUCCESS,
    GET_PROJECTS_ERROR,
    GET_PROJECTS_SUCCESS,
    INIT_PROJECTAPI,
    SELECT_PROJECT,
} from './projectActionTypes'
import { LOGOUT } from '../../auth/authActionTypes'
import { SAVE_VOTEITEMS_SUCCESS } from '../settings/votingForm/votingFormActionTypes'

const initState = {
    data: {
        projects: [],
    },
    projectApiInit: false,
    projectsLoaded: false,
    projectLoadError: null,
    projectVotesError: null,
    selectedProjectId: null,
}

const projectReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case LOGOUT:
            return initState
        case ADD_PROJECT_ONGOING:
            return {
                ...state,
                // prevent the Project component to display 404 during a short period
                projectsLoaded: false,
            }
        case GET_PROJECTS_SUCCESS:
            return {
                ...state,
                data: {
                    projects: payload,
                },
                projectsLoaded: true,
            }
        case GET_PROJECT_SUCCESS: {
            const newProjectsArray = Array.from(state.data.projects).filter(
                (project) => project.id !== payload.id
            )

            newProjectsArray.push(payload)

            return {
                ...state,
                data: {
                    ...state.data,
                    projects: newProjectsArray,
                },
            }
        }
        case SELECT_PROJECT:
            return {
                ...state,
                selectedProjectId: payload,
            }
        case EDIT_PROJECT_SUCCESS: {
            const projects = state.data.projects.map((project) => {
                if (project.id === state.selectedProjectId) {
                    return {
                        ...project,
                        ...payload,
                    }
                }
                return project
            })

            return {
                ...state,
                data: {
                    ...state.data,
                    projects: projects,
                },
            }
        }
        case INIT_PROJECTAPI: {
            return {
                ...state,
                projectApiInit: true,
            }
        }
        case SAVE_VOTEITEMS_SUCCESS: {
            return {
                ...state,
                data: {
                    ...state.data,
                    projects: state.data.projects.map((project) => {
                        if (project.id === state.selectedProjectId) {
                            return {
                                ...project,
                                voteItems: payload,
                            }
                        }
                        return project
                    }),
                },
            }
        }
        case GET_PROJECTS_ERROR:
            // eslint-disable-next-line no-console
            console.error(payload)
            return {
                ...state,
                projectLoadError: payload,
            }
        default:
            return state
    }
}

export default projectReducer
