import {
    GET_PROJECT_ERROR,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_VOTE_ITEMS_ERROR,
    GET_PROJECT_VOTE_ITEMS_SUCCESS,
    GET_PROJECT_VOTE_RESULT_ERROR,
    GET_PROJECT_VOTE_RESULT_SUCCESS,
    SET_SELECTED_DATE
} from './projectActionTypes'
import { fireStoreMainInstance, initFireStoreSchedule } from '../../firebase'
import { getProjectSelector } from './projectSelectors'
import { orderBy, sortBy } from 'lodash/collection'

export const getProject = projectId => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .get()
            .then(projectSnapshot => {
                if (projectSnapshot.exists) {
                    const project = projectSnapshot.data()
                    project.id = projectId

                    initFireStoreSchedule(project.firebaseConfig)

                    dispatch({
                        type: GET_PROJECT_SUCCESS,
                        payload: project
                    })
                } else {
                    dispatch({
                        type: GET_PROJECT_ERROR,
                        payload:
                            'Unknown project id, probably some copy-past issue?'
                    })
                }
            })
            .catch(err => {
                dispatch({
                    type: GET_PROJECT_ERROR,
                    payload: err.toString()
                })
            })
    }
}

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
                    payload: orderBy(voteItems, ['position'], ['desc'])
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_PROJECT_VOTE_ITEMS_ERROR,
                    payload: err.toString()
                })
            })
    }
}

export const setSelectedDate = date => ({
    type: SET_SELECTED_DATE,
    payload: {
        date: date
    }
})

export const getVoteResult = () => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(getProjectSelector(getState()).id)
            .collection('sessionVotes')
            .get()
            .then(projectSnapshot => {
                const sessions = {}
                projectSnapshot.forEach(doc => {
                    sessions[doc.id] = {
                        ...doc.data(),
                        id: doc.id
                    }
                })

                dispatch({
                    type: GET_PROJECT_VOTE_RESULT_SUCCESS,
                    payload: sessions
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_PROJECT_VOTE_RESULT_ERROR,
                    payload: err
                })
            })
    }
}
