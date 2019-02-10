import {
    ADD_VOTE_BEFORE_SUCCESS,
    ADD_VOTE_ERROR,
    ADD_VOTE_SUCCESS,
    DELETE_VOTE_LOAD_ERROR,
    DELETE_VOTE_POST_ERROR,
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
import { INCREMENT_VOTE_LOCALY } from '../project/projectActionTypes'
import { VOTE_TYPE_TEXT } from './voteReducer'

export const voteFor = (sessionId, voteItem) => {
    return (dispatch, getState) => {
        const voteContent = {
            projectId: getProjectSelector(getState()).id,
            sessionId: sessionId,
            voteItemId: voteItem.id,
            id: new Date().getTime(),
            createdAt: serverTimestamp()
        }

        if (voteItem.type === VOTE_TYPE_TEXT) {
            console.log('not managed')

            return
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
                        error: error.toString(),
                        tempVoteId: voteContent.id
                    }
                })

                dispatch({
                    type: INCREMENT_VOTE_LOCALY,
                    payload: {
                        vote: voteContent,
                        amount: -1
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
                        error: error.toString(),
                        voteWhichShouldHaveBeenDeleted: voteToDelete
                    }
                })

                dispatch({
                    type: INCREMENT_VOTE_LOCALY,
                    payload: {
                        vote: voteToDelete,
                        amount: 1
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

export const removeVotePostError = () => {
    return (dispatch, getState) => {
        dispatch({
            type: DELETE_VOTE_POST_ERROR
        })
    }
}

export const removeVoteLoadError = () => {
    return (dispatch, getState) => {
        dispatch({
            type: DELETE_VOTE_LOAD_ERROR
        })
    }
}
