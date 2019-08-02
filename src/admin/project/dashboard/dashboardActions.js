import {
    GET_SESSION_VOTES_ERROR,
    GET_SESSION_VOTES_SUCCESS,
    GET_USER_VOTES_ERROR,
    GET_USER_VOTES_SUCCESS
} from './dashboardActionTypes'
import { fireStoreMainInstance } from '../../../firebase'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'

export const getSessionVotes = () => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(getSelectedProjectIdSelector(getState()))
            .collection('sessionVotes')
            .get()
            .then(snapshot => {
                const sessionVotes = []
                snapshot.forEach(doc => {
                    sessionVotes.push({
                        id: doc.id,
                        votes: doc.data()
                    })
                })

                dispatch({
                    type: GET_SESSION_VOTES_SUCCESS,
                    payload: sessionVotes
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_SESSION_VOTES_ERROR,
                    payload: err.toString()
                })
            })
    }
}

export const getUserVotes = () => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(getSelectedProjectIdSelector(getState()))
            .collection('userVotes')
            .orderBy('createdAt')
            .get()
            .then(snapshot => {
                const userVotes = []
                snapshot.forEach(doc => {
                    userVotes.push({
                        fireStoreId: doc.id,
                        ...doc.data()
                    })
                })

                dispatch({
                    type: GET_USER_VOTES_SUCCESS,
                    payload: userVotes
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_USER_VOTES_ERROR,
                    payload: err.toString()
                })
            })
    }
}
