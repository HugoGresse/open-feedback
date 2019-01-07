import {
    ADD_VOTE_ERROR,
    ADD_VOTE_SUCCESS,
    GET_USER_VOTES_ERROR,
    GET_USER_VOTES_SUCCESS
} from './voteActionTypes'
import { fireStoreMainInstance, serverTimestamp } from '../../firebase'
import { getUser } from '../auth'
import { getProjectSelector } from '../project/projectSelectors'

export const voteFor = (sessionId, voteItemId) => {
    return (dispatch, getState) => {
        console.log('new vote', sessionId, voteItemId, getUser(getState()).uid)
        const voteContent = {
            projectId: getProjectSelector(getState()).id,
            sessionId: sessionId,
            voteItemId: voteItemId,
            createdAt: serverTimestamp()
        }

        fireStoreMainInstance
            .collection('users')
            .doc(getUser(getState()).uid)
            .collection('votes')
            .add(voteContent)
            .then(docRef => {
                console.log('Vote casted, ID: ', docRef.id)
                // TODO : dispatch a priarly action to update the UI before the actual result

                const dispatchObject = {
                    [docRef.id]: voteContent
                }
                dispatch({
                    type: ADD_VOTE_SUCCESS,
                    payload: dispatchObject
                })
            })
            .catch(error => {
                dispatch({
                    type: ADD_VOTE_ERROR,
                    payload: error
                })
            })

        // TODO : to get the data, new cloud function that when vriting a vote agregate the result for a given session
        /**
         * project > sessionVote > sessionId > voteItemsIds: [uid, uid, ... ]
         */
    }
}

export const getVotes = () => {
    return (dispatch, getState) => {
        fireStoreMainInstance
            .collection('users')
            .doc(getUser(getState()).uid)
            .collection('votes')
            .where('projectId', '==', getProjectSelector(getState()).id)
            .get()
            .then(voteSnapshot => {
                const votes = {}
                voteSnapshot.forEach(doc => {
                    votes[doc.id] = doc.data()
                })
                dispatch({
                    type: GET_USER_VOTES_SUCCESS,
                    payload: votes
                })
            })
            .catch(error => {
                dispatch({
                    type: GET_USER_VOTES_ERROR,
                    payload: error
                })
            })
    }
}
