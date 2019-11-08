import {
    ADD_VOTE_BEFORE_SUCCESS,
    ADD_VOTE_ERROR,
    ADD_VOTE_SUCCESS,
    DELETE_VOTE_LOAD_ERROR,
    DELETE_VOTE_POST_ERROR,
    GET_USER_VOTES_ERROR,
    GET_USER_VOTES_SUCCESS,
    REMOVE_VOTE_BEFORE_SUCCESS,
    REMOVE_VOTE_SUCCESS,
    UPDATE_VOTE_ERROR,
    UPDATE_VOTE_SUCCESS
} from './voteActionTypes'
import {
    fireStoreMainInstance,
    nowTimestamp,
    serverTimestamp
} from '../../firebase'
import {getUserSelector} from '../auth/authSelectors'
import {getProjectSelector} from '../project/projectSelectors'
import {getCurrentUserVotesSelector} from './voteSelectors'
import {INCREMENT_VOTE_LOCALLY} from '../project/projectActionTypes'
import {VOTE_TYPE_TEXT} from './voteReducer'
import {checkDateBeforeVote} from './checkDataBeforeVote'

export const voteFor = (sessionId, voteItem, data) => {
    return (dispatch, getState) => {
        if (checkDateBeforeVote(dispatch, getState())) {
            return
        }

        if (!getUserSelector(getState()).isAnonymous) {
            dispatch({
                type: ADD_VOTE_ERROR,
                payload: {
                    error:
                        'You are logged in to the admin, your vote will not be anonymous.'
                }
            })
        }

        const projectId = getProjectSelector(getState()).id

        const voteContent = {
            projectId: projectId,
            sessionId: sessionId,
            voteItemId: voteItem.id,
            id: new Date().getTime(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: getUserSelector(getState()).uid
        }

        if (voteItem.type === VOTE_TYPE_TEXT) {
            voteContent.text = data.trim()
            if (voteContent.text.length === 0) {
                return
            }
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
            type: INCREMENT_VOTE_LOCALLY,
            payload: {
                vote: voteContent,
                amount: 1
            }
        })

        fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .collection('userVotes')
            .add(voteContent)
            .then(docRef => {
                dispatch({
                    type: ADD_VOTE_SUCCESS,
                    payload: {
                        vote: {
                            [docRef.id]: {
                                ...voteContent,
                                id: docRef.id,
                                createdAt: nowTimestamp(),
                                updatedAt: nowTimestamp()
                            }
                        },
                        sessionId: voteContent.sessionId,
                        voteItemId: voteContent.voteItemId,
                        tempVoteId: voteContent.id,
                        newVoteId: docRef.id
                    }
                })
            })
            .catch(error => {
                dispatch({
                    type: ADD_VOTE_ERROR,
                    payload: {
                        error: `Unable to save the vote, ${error}`,
                        tempVoteId: voteContent.id
                    }
                })

                dispatch({
                    type: INCREMENT_VOTE_LOCALLY,
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
        if (getCurrentUserVotesSelector(getState())[voteToDelete.id].temp) {
            // eslint-disable-next-line no-console
            console.info(
                'Unable to delete vote as it has not been writed on the database'
            )
            return
        }

        if (checkDateBeforeVote(dispatch, getState())) {
            return
        }

        dispatch({
            type: REMOVE_VOTE_BEFORE_SUCCESS,
            payload: voteToDelete
        })

        dispatch({
            type: INCREMENT_VOTE_LOCALLY,
            payload: {
                vote: voteToDelete,
                amount: -1
            }
        })

        fireStoreMainInstance
            .collection('projects')
            .doc(getProjectSelector(getState()).id)
            .collection('userVotes')
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
                    type: ADD_VOTE_ERROR,
                    payload: {
                        error: `Unable to save the vote, ${error}`,
                        voteWhichShouldHaveBeenDeleted: voteToDelete
                    }
                })

                dispatch({
                    type: INCREMENT_VOTE_LOCALLY,
                    payload: {
                        vote: voteToDelete,
                        amount: 1
                    }
                })
            })
    }
}

export const updateVote = (vote, data) => (dispatch, getState) => {
    if (checkDateBeforeVote(dispatch, getState()) || data.trim().length === 0) {
        return
    }

    dispatch({
        type: INCREMENT_VOTE_LOCALLY,
        payload: {
            vote: {
                ...vote,
                text: data.trim()
            }
        }
    })

    fireStoreMainInstance
        .collection('projects')
        .doc(getProjectSelector(getState()).id)
        .collection('userVotes')
        .doc(vote.id)
        .update({
            text: data,
            updatedAt: serverTimestamp()
        })
        .then(() => {
            dispatch({
                type: UPDATE_VOTE_SUCCESS,
                payload: {
                    vote: {
                        [vote.id]: {
                            ...vote,
                            text: data
                        }
                    }
                }
            })
        })
        .catch(error => {
            dispatch({
                type: UPDATE_VOTE_ERROR,
                payload: {
                    error: error.toString(),
                    voteId: vote.id
                }
            })
        })
}

export const getVotes = () => {
    return (dispatch, getState) => {
        fireStoreMainInstance
            .collection('projects')
            .doc(getProjectSelector(getState()).id)
            .collection('userVotes')
            .where('userId', '==', getUserSelector(getState()).uid)
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

export const removeVotePostError = () => ({
    type: DELETE_VOTE_POST_ERROR
})

export const removeVoteLoadError = () => ({
    type: DELETE_VOTE_LOAD_ERROR
})
