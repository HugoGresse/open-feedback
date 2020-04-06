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
    functions,
    serverTimestamp,
} from '../../../firebase'
import { getUserSelector } from '../../auth/authSelectors'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from './projectSelectors'
import { CLEAR_TALK_VOTES } from '../dashboard/dashboardActionTypes'
import { initProjectApi } from '../../../core/setupType/projectApi'
import { newRandomHexColor } from '../../../utils/colorsUtils'
import { addNotification } from '../../notification/notifcationActions'
import { trackNewProject } from '../../utils/track'
import { deleteOldFilesIfNewValueDiffer } from '../utils/storage/deleteImageIfPossible'

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
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'project.errorProjectsLoad',
                    })
                )
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
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'project.errorLoad',
                })
            )
        })
}

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
    return Promise.resolve()
}

export const selectProject = projectId => (dispatch, getState) => {
    const currentSelectedProjectId = getSelectedProjectIdSelector(getState())
    if (currentSelectedProjectId === projectId) {
        // Project already selected (HMR potentially)
        return Promise.resolve(true)
    }

    dispatch({
        type: SELECT_PROJECT,
        payload: projectId,
    })

    dispatch(
        initProjectApiIfReady(projectId, getSelectedProjectSelector(getState()))
    )

    return Promise.resolve(false)
}

export const editProject = projectData => (dispatch, getState) => {
    const currentProject = getSelectedProjectSelector(getState())
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
            dispatch(
                addNotification({
                    type: 'success',
                    i18nkey: 'project.saveSuccess',
                })
            )

            dispatch({
                type: EDIT_PROJECT_SUCCESS,
                payload: projectData,
            })
            dispatch(
                deleteOldFilesIfNewValueDiffer(currentProject, projectData, [
                    'favicon',
                    'logoSmall',
                ])
            )
        })
        .catch(err => {
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'project.saveFail',
                })
            )

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
            dispatch(
                addNotification({
                    type: 'success',
                    i18nkey: 'project.newSuccess',
                })
            )
            dispatch({
                type: ADD_PROJECT_SUCCESS,
                payload: projectId,
            })
            trackNewProject(projectData.name, projectData.setupType)
            return projectId
        })
        .catch(err => {
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'project.newFail',
                    message: err.toString(),
                })
            )
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

export const deleteProject = (projectId, t) => dispatch =>
    functions
        .deleteProject({
            projectId: projectId,
        })
        // eslint-disable-next-line no-console
        .then(() => {
            dispatch(
                addNotification({
                    type: 'success',
                    message: t('settingsSetup.deleteEvent.deleted'),
                })
            )
        })
        .catch(error => {
            // eslint-disable-next-line no-console
            console.error(error)

            if (error.code === 'permission-denied') {
                dispatch(
                    addNotification({
                        type: 'error',
                        message: t(
                            'settingsSetup.deleteEvent.errors.permissionDenied'
                        ),
                    })
                )
            } else {
                dispatch(
                    addNotification({
                        type: 'error',
                        message:
                            t('settingsSetup.deleteEvent.errors.defaultError') +
                            error.toString(),
                    })
                )
            }

            return Promise.reject()
        })

export const initProjectApiIfReady = (projectId, project) => dispatch => {
    if (projectId && project && project.setupType) {
        initProjectApi(project.setupType, project)
        dispatch({
            type: INIT_PROJECTAPI,
        })
    }
}
