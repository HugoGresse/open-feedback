import {
    GET_TALK_VOTES_ERROR,
    GET_TALK_VOTES_SUCCESS,
    GET_USER_VOTES_ERROR,
    GET_USER_VOTES_SUCCESS,
} from './dashboardActionTypes'
import { fireStoreMainInstance } from '../../../firebase.ts'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'

export const getTalkVotes = () => {
    return (dispatch, getState) => {
        const projectId = getSelectedProjectIdSelector(getState())

        if (!projectId) {
            return
        }

        return fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .collection('sessionVotes')
            .get()
            .then((snapshots) => {
                const talkVotes = {}
                snapshots.forEach((doc) => {
                    talkVotes[doc.id] = {
                        id: doc.id,
                        votes: doc.data(),
                    }
                })

                dispatch({
                    type: GET_TALK_VOTES_SUCCESS,
                    payload: talkVotes,
                })
            })
            .catch((err) => {
                dispatch({
                    type: GET_TALK_VOTES_ERROR,
                    payload: err.toString(),
                })
            })
    }
}

export const getUserVotes = () => {
    return (dispatch, getState) => {
        const projectId = getSelectedProjectIdSelector(getState())

        if (!projectId) {
            return
        }
        return fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .collection('userVotes')
            .orderBy('createdAt')
            .get()
            .then((snapshot) => {
                const userVotes = []
                snapshot.forEach((doc) => {
                    userVotes.push({
                        fireStoreId: doc.id,
                        ...doc.data(),
                    })
                })

                dispatch({
                    type: GET_USER_VOTES_SUCCESS,
                    payload: userVotes,
                })
            })
            .catch((err) => {
                dispatch({
                    type: GET_USER_VOTES_ERROR,
                    payload: err.toString(),
                })
            })
    }
}
