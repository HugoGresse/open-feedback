import {
    EDIT_PROJECT_ERROR,
    EDIT_PROJECT_SUCCESS,
    GET_PROJECTS_ERROR,
    GET_PROJECTS_SUCCESS,
    SELECT_PROJECT
} from './projectActionTypes'
import { fireStoreMainInstance } from '../../firebase'
import { getUserSelector } from '../auth/authSelectors'
import { getSelectedProjectIdSelector } from './projectSelectors'

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

export const selectProject = projectId => (dispatch, getState) => {
    dispatch({
        type: SELECT_PROJECT,
        payload: projectId
    })
}

export const editProject = projectData => (dispatch, getState) => {
    fireStoreMainInstance
        .collection('projects')
        .doc(getSelectedProjectIdSelector(getState()))
        .set(projectData, { merge: true })
        .then(() => {
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

/*
export const getVoteItems = () => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(getProjectSelector(getState()).id)
            .collection('voteItems')
            .get()
            .then(projectSnapshot => {
                const voteItems = []
                projectSnapshot.forEach(doc => {
                    voteItems.push({
                        ...doc.data(),
                        id: doc.id
                    })
                })

                dispatch({
                    type: GET_PROJECT_VOTE_ITEMS_SUCCESS,
                    payload: voteItems
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_PROJECT_VOTE_ITEMS_ERROR,
                    payload: err.toString()
                })
            })
    }
}*/
