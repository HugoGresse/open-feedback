import {
    ADD_PROJECT_ERROR,
    ADD_PROJECT_ONGOING,
    DELETE_PROJECT_SUCCESS,
    type AdminProject,
    EDIT_PROJECT_SUCCESS,
    GET_PROJECT_ERROR,
    GET_PROJECT_SUCCESS,
    GET_PROJECTS_ERROR,
    GET_PROJECTS_SUCCESS,
    INIT_PROJECTAPI,
    type ProjectAction,
    SELECT_PROJECT,
} from './projectActionTypes'
import { LOGOUT, type LogoutAction } from '../../auth/authActionTypes'
import {
    SAVE_VOTEITEMS_SUCCESS,
    type SaveVoteItemsSuccessAction,
} from '../settings/votingForm/votingFormActionTypes.tsx'

export interface ProjectState {
    data: {
        projects: AdminProject[]
    }
    projectApiInit: boolean
    projectsLoaded: boolean
    projectLoadError: string | null
    projectVotesError: string | null
    selectedProjectId: string | null
}

const initState: ProjectState = {
    data: {
        projects: [],
    },
    projectApiInit: false,
    projectsLoaded: false,
    projectLoadError: null,
    projectVotesError: null,
    selectedProjectId: null,
}

export const projectReducer = (
    state: ProjectState = initState,
    action: ProjectAction | LogoutAction | SaveVoteItemsSuccessAction
): ProjectState => {
    switch (action.type) {
        case LOGOUT:
            return initState
        case ADD_PROJECT_ONGOING:
            return {
                ...state,
                // prevent the Project component to display 404 during a short period
                projectsLoaded: false,
            }
        case ADD_PROJECT_ERROR:
            return {
                ...state,
                projectsLoaded: true,
            }
        case GET_PROJECTS_SUCCESS: {
            const projects = action.payload.reduce<AdminProject[]>(
                (acc, item) => {
                    const existingProjectIndex = acc.findIndex(
                        (p) => p.id === item.id
                    )
                    if (existingProjectIndex > -1) {
                        acc[existingProjectIndex] = item
                    } else {
                        acc.push(item)
                    }
                    return acc
                },
                [...state.data.projects]
            )

            return {
                ...state,
                data: {
                    projects,
                },
                projectsLoaded: true,
            }
        }
        case GET_PROJECT_SUCCESS: {
            const { payload } = action
            const newProjectsArray = Array.from(state.data.projects).filter(
                (project) => project.id !== payload.id
            )

            newProjectsArray.push(payload)

            // The untyped code also wrote `projectsLoaded: true` inside `data`,
            // a key nothing ever read; it is dropped.
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
                selectedProjectId: action.payload,
            }
        case EDIT_PROJECT_SUCCESS: {
            const projects = state.data.projects.map((project) => {
                if (project.id === state.selectedProjectId) {
                    return {
                        ...project,
                        ...action.payload,
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
        case DELETE_PROJECT_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    projects: state.data.projects.filter(
                        (project) => project.id !== action.payload
                    ),
                },
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
                                voteItems: action.payload,
                            }
                        }
                        return project
                    }),
                },
            }
        }
        case GET_PROJECTS_ERROR:
            // biome-ignore lint/suspicious/noConsole: intentional log
            console.error(action.payload)
            return {
                ...state,
                projectLoadError: action.payload,
            }
        case GET_PROJECT_ERROR:
            // biome-ignore lint/suspicious/noConsole: intentional log
            console.error(action.payload)
            return {
                ...state,
                projectLoadError: action.payload,
                projectsLoaded: true,
            }
        default:
            return state
    }
}
