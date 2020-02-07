import {
    ADD_PROJECT_ERROR,
    ADD_PROJECT_ONGOING,
    ADD_PROJECT_SUCCESS,
    EDIT_PROJECT_ERROR,
    EDIT_PROJECT_SUCCESS,
    GET_PROJECT_ERROR,
    GET_PROJECT_SUCCESS,
    GET_PROJECTS_ERROR,
    GET_PROJECTS_SUCCESS,
    INIT_PROJECTAPI,
    SELECT_PROJECT,
} from './projectActionTypes'
import {
    deleteField,
    fireStoreMainInstance,
    serverTimestamp,
} from '../../../firebase'
import { getUserSelector } from '../../auth/authSelectors'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from './projectSelectors'
import { ADD_NOTIFICATION } from '../../notification/notificationActionTypes'
import { history } from '../../../App'
import { initProjectApi } from '../../../core/setupType/projectApi'
import { newRandomHexColor } from '../../../utils/colorsUtils'
import { CLEAR_TALKS } from '../../../core/talks/talksActionTypes'

export const getProjects = () => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .where(`members`, 'array-contains', getUserSelector(getState()).uid)
            .orderBy('createdAt', 'desc')
            .get()
            .then(projectsSnapshot => {
                const projects = []
                projectsSnapshot.forEach(doc => {
                    projects.push({
                        id: doc.id,
                        ...doc.data(),
                    })
                })

                dispatch({
                    type: GET_PROJECTS_SUCCESS,
                    payload: projects,
                })
            })
            .then(() => {
                dispatch(
                    initProjectApiIfReady(
                        getSelectedProjectIdSelector(getState()),
                        getSelectedProjectSelector(getState())
                    )
                )
            })
            .catch(err => {
                dispatch({
                    type: GET_PROJECTS_ERROR,
                    payload: err.toString(),
                })
            })
    }
}

export const getProject = (selectedProjectId = null) => (
    dispatch,
    getState
) => {
    return fireStoreMainInstance
        .collection('projects')
        .doc(selectedProjectId || getSelectedProjectIdSelector(getState()))
        .get()
        .then(doc => {
            dispatch({
                type: GET_PROJECT_SUCCESS,
                payload: {
                    id: doc.id,
                    ...doc.data(),
                },
            })
        })
        .catch(err => {
            dispatch({
                type: GET_PROJECT_ERROR,
                payload: err.toString(),
            })
        })
}

export const selectProject = projectId => (dispatch, getState) => {
    const currentSelectedProjectId = getSelectedProjectIdSelector(getState())
    if (currentSelectedProjectId === projectId) {
        // Project already selected (HMR potentially)
        return
    }

    dispatch({
        type: CLEAR_TALKS,
    })
    dispatch({
        type: SELECT_PROJECT,
        payload: projectId,
    })

    dispatch(
        initProjectApiIfReady(projectId, getSelectedProjectSelector(getState()))
    )

    // If we have switch the project at runtime
    if (
        currentSelectedProjectId &&
        history.location.pathname.includes(currentSelectedProjectId)
    ) {
        const redirectUrl = history.location.pathname.replace(
            currentSelectedProjectId,
            projectId
        )

        history.push(redirectUrl)
    } else if (
        !currentSelectedProjectId &&
        history.location.pathname.includes(projectId)
    ) {
        // No nothing, hard refresh, id in url but not in states
    } else {
        history.push(`${history.location.pathname}${projectId}`)
    }
}

export const editProject = projectData => (dispatch, getState) => {
    if (
        !projectData.restrictVoteRange &&
        projectData.restrictVoteRange !== undefined
    ) {
        projectData.voteStartTime = deleteField()
        projectData.voteEndTime = deleteField()
    }
    delete projectData.restrictVoteRange

    return fireStoreMainInstance
        .collection('projects')
        .doc(getSelectedProjectIdSelector(getState()))
        .set(projectData, { merge: true })
        .then(() => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'success',
                    message: 'Event saved',
                },
            })

            dispatch({
                type: EDIT_PROJECT_SUCCESS,
                payload: projectData,
            })
        })
        .catch(err => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: 'Failed to save the event',
                },
            })

            dispatch({
                type: EDIT_PROJECT_ERROR,
                payload: err.toString(),
            })
        })
}

export const getNewProjectId = () => {
    return fireStoreMainInstance.collection('projects').doc().id
}

export const newProject = (projectId, projectData) => (dispatch, getState) => {
    dispatch({
        type: ADD_PROJECT_ONGOING,
    })

    projectData.owner = getUserSelector(getState()).uid
    projectData.members = [projectData.owner]
    projectData.createdAt = serverTimestamp()
    projectData.chipColors = [newRandomHexColor()]
    projectData.favicon = `${window.location.protocol}//${window.location.host}/favicon-32x32.png`
    projectData.logoSmall = `${window.location.protocol}//${window.location.host}/android-chrome-192x192.png`

    return fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .set(projectData)
        .then(() => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'success',
                    message: 'New event created! Redirecting you now...',
                },
            })
            dispatch({
                type: ADD_PROJECT_SUCCESS,
                payload: projectId,
            })
            return projectId
        })
        .catch(err => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: 'Fail to create a new event, ' + err.toString(),
                },
            })
            dispatch({
                type: ADD_PROJECT_ERROR,
                payload: err.toString(),
            })
        })
}

// Not using Thinks (dispatch, etc)
export const doesProjectExist = projectId => {
    return fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .get()
        .then(result => result.exists)
        .catch(error => {
            // eslint-disable-next-line no-console
            console.error(error)
            return true
        })
}

export const deleteProject = projectId => dispatch => {
    return fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .delete()
        .then(() => {
            history.push(
                history.location.pathname.substring(
                    0,
                    history.location.pathname.indexOf(projectId)
                )
            )
        })
        .catch(error => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: 'Failed to delete the event, ' + error.toString(),
                },
            })
        })
}

export const initProjectApiIfReady = (projectId, project) => dispatch => {
    if (projectId && project && project.setupType) {
        initProjectApi(project.setupType, project)
        dispatch({
            type: INIT_PROJECTAPI,
        })
    }
}
