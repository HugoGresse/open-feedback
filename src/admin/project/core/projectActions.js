import {
    ADD_PROJECT_ERROR,
    ADD_PROJECT_SUCCESS,
    EDIT_PROJECT_ERROR,
    EDIT_PROJECT_SUCCESS,
    GET_PROJECT_ERROR,
    GET_PROJECT_SUCCESS,
    GET_PROJECTS_ERROR,
    GET_PROJECTS_SUCCESS,
    SELECT_PROJECT
} from './projectActionTypes'
import { fireStoreMainInstance } from '../../../firebase'
import { getUserSelector } from '../../auth/authSelectors'
import { getSelectedProjectIdSelector } from './projectSelectors'
import { ADD_NOTIFICATION } from '../../notification/notificationActionTypes'

export const getProjects = () => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .where(`members`, 'array-contains', getUserSelector(getState()).uid)
            .get()
            .then(projectsSnapshot => {
                const projects = []
                projectsSnapshot.forEach(doc => {
                    projects.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })

                dispatch({
                    type: GET_PROJECTS_SUCCESS,
                    payload: projects
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_PROJECTS_ERROR,
                    payload: err.toString()
                })
            })
    }
}

export const getProject = () => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(getSelectedProjectIdSelector(getState()))
            .get()
            .then(doc => {
                dispatch({
                    type: GET_PROJECT_SUCCESS,
                    payload: {
                        id: doc.id,
                        ...doc.data()
                    }
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_PROJECT_ERROR,
                    payload: err.toString()
                })
            })
    }
}

export const selectProject = projectId => dispatch => {
    dispatch({
        type: SELECT_PROJECT,
        payload: projectId
    })
}

export const editProject = projectData => (dispatch, getState) => {
    return fireStoreMainInstance
        .collection('projects')
        .doc(getSelectedProjectIdSelector(getState()))
        .set(projectData, { merge: true })
        .then(() => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'success',
                    message: 'Project saved'
                }
            })

            dispatch({
                type: EDIT_PROJECT_SUCCESS
            })
        })
        .catch(err => {
            dispatch({
                type: EDIT_PROJECT_ERROR,
                payload: err.toString()
            })
        })
}

export const newProject = projectData => (dispatch, getState) => {
    projectData.owner = getUserSelector(getState()).uid
    projectData.members = [projectData.owner]

    return fireStoreMainInstance
        .collection('projects')
        .add(projectData)
        .then(docRef => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'success',
                    message: 'New event created! Redirecting you now...'
                }
            })
            dispatch({
                type: ADD_PROJECT_SUCCESS,
                payload: docRef.id
            })
            return docRef.id
        })
        .catch(err => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: 'Fail to create a new event, ' + err.toString()
                }
            })
            dispatch({
                type: ADD_PROJECT_ERROR,
                payload: err.toString()
            })
        })
}
