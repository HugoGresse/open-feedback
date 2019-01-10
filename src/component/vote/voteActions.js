import {
    ADD_VOTE_BEFORE_SUCCESS,
    ADD_VOTE_ERROR,
    ADD_VOTE_SUCCESS,
    GET_USER_VOTES_ERROR,
    GET_USER_VOTES_SUCCESS,
    REMOVE_VOTE_BEFORE_SUCCESS,
    REMOVE_VOTE_ERROR,
    REMOVE_VOTE_SUCCESS
} from './voteActionTypes'
import { fireStoreMainInstance, serverTimestamp } from '../../firebase'
import { getUser } from '../auth'
import { getProjectSelector } from '../project/projectSelectors'
import { getVotesSelector } from './voteSelectors'
import { getVoteResult } from '../project/projectActions'
import {
    GET_PROJECT_VOTE_RESULT_SUCCESS,
    INCREMENT_VOTE_LOCALY
} from '../project/projectActionTypes'

export const voteFor = (sessionId, voteItemId) => {
    return (dispatch, getState) => {
        const voteContent = {
            projectId: getProjectSelector(getState()).id,
            sessionId: sessionId,
            voteItemId: voteItemId,
            id: new Date().getTime(),
            createdAt: serverTimestamp()
        }

        dispatch({
            type: ADD_VOTE_BEFORE_SUCCESS,
            payload: {
                [voteContent.id]: {
                    ...voteContent,
                    temp: true
                }
            }
        })

        dispatch({
            type: INCREMENT_VOTE_LOCALY,
            payload: {
                vote: voteContent,
                amount: 1
            }
        })

        fireStoreMainInstance
            .collection('users')
            .doc(getUser(getState()).uid)
            .collection('votes')
            .add(voteContent)
            .then(docRef => {
                dispatch({
                    type: ADD_VOTE_SUCCESS,
                    payload: {
                        vote: {
                            [docRef.id]: {
                                ...voteContent,
                                id: docRef.id
                            }
                        },
                        tempVoteId: voteContent.id
                    }
                })
            })
            .catch(error => {
                dispatch({
                    type: ADD_VOTE_ERROR,
                    payload: {
                        error: error,
                        tempVoteId: voteContent.id
                    }
                })
            })
    }
}

export const removeVote = voteToDelete => {
    return (dispatch, getState) => {
        if (getVotesSelector(getState())[voteToDelete.id].temp) {
            console.info(
                'Unable to delete vote as it has not been writed on the database'
            )
            return
        }

        dispatch({
            type: REMOVE_VOTE_BEFORE_SUCCESS,
            payload: voteToDelete
        })

        dispatch({
            type: INCREMENT_VOTE_LOCALY,
            payload: {
                vote: voteToDelete,
                amount: -1
            }
        })

        fireStoreMainInstance
            .collection('users')
            .doc(getUser(getState()).uid)
            .collection('votes')
            .doc(voteToDelete.id)
            .delete()
            .then(() => {
                dispatch({
                    type: REMOVE_VOTE_SUCCESS,
                    payload: voteToDelete
                })
            })
            .catch(error => {
                dispatch({
                    type: REMOVE_VOTE_ERROR,
                    payload: {
                        error: error,
                        voteWhichShouldHaveBeenDeleted: voteToDelete
                    }
                })
            })
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
                    votes[doc.id].id = doc.id
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
