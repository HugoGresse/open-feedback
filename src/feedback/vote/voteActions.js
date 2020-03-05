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
    UPDATE_VOTE_SUCCESS,
} from './voteActionTypes'
import { fireStoreMainInstance, serverTimestamp } from '../../firebase'
import { getUserSelector } from '../auth/authSelectors'
import { getProjectSelector } from '../project/projectSelectors'
import {
    getCurrentUserVotesSelector,
    getUserVotesByTalkAndVoteItemSelector,
} from './voteSelectors'
import { INCREMENT_VOTE_LOCALLY } from '../project/projectActionTypes'
import { VOTE_TYPE_TEXT } from './voteReducer'
import { checkDateBeforeVote } from './checkDataBeforeVote'
import { VOTE_STATUS_ACTIVE, VOTE_STATUS_DELETED } from '../../core/contants'

export const voteFor = (talkId, voteItem, data) => {
    return (dispatch, getState) => {
        if (checkDateBeforeVote(dispatch, getState())) {
            return
        }

        if (!getUserSelector(getState()).isAnonymous) {
            dispatch({
                type: ADD_VOTE_ERROR,
                payload: {
                    error:
                        'You are logged in to the admin, your vote will not be anonymous.',
                },
            })
        }

        const projectId = getProjectSelector(getState()).id

        const existingVote = getUserVotesByTalkAndVoteItemSelector(getState())[
            voteItem.id
        ]

        let id = ''
        if (existingVote) {
            if (existingVote.pending) {
                // eslint-disable-next-line no-console
                console.info(
                    'Unable to modify a vote that has not been writed on the database'
                )
                return
            }

            id = existingVote.id
        } else {
            id = fireStoreMainInstance
                .collection('projects')
                .doc(projectId)
                .collection('userVotes')
                .doc().id
        }

        const voteContent = {
            projectId: projectId,
            talkId: talkId,
            voteItemId: voteItem.id,
            id: id,
            createdAt: existingVote
                ? existingVote.createdAt
                : serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: getUserSelector(getState()).uid,
            status: VOTE_STATUS_ACTIVE,
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
                    pending: true,
                },
            },
        })

        dispatch({
            type: INCREMENT_VOTE_LOCALLY,
            payload: {
                vote: voteContent,
                amount: 1,
            },
        })

        fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .collection('userVotes')
            .doc(id)
            .set(voteContent, { merge: true })
            .then(() => {
                dispatch({
                    type: ADD_VOTE_SUCCESS,
                    payload: {
                        voteId: id,
                    },
                })
            })
            .catch(error => {
                dispatch({
                    type: ADD_VOTE_ERROR,
                    payload: {
                        error: `Unable to save the vote, ${error}`,
                        voteId: voteContent.id,
                    },
                })

                dispatch({
                    type: INCREMENT_VOTE_LOCALLY,
                    payload: {
                        vote: voteContent,
                        amount: -1,
                    },
                })
            })
    }
}

export const removeVote = voteToDelete => {
    return (dispatch, getState) => {
        if (getCurrentUserVotesSelector(getState())[voteToDelete.id].pending) {
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
            payload: voteToDelete,
        })

        dispatch({
            type: INCREMENT_VOTE_LOCALLY,
            payload: {
                vote: voteToDelete,
                amount: -1,
            },
        })

        fireStoreMainInstance
            .collection('projects')
            .doc(getProjectSelector(getState()).id)
            .collection('userVotes')
            .doc(voteToDelete.id)
            .set(
                {
                    status: VOTE_STATUS_DELETED,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            )
            .then(() => {
                dispatch({
                    type: REMOVE_VOTE_SUCCESS,
                    payload: voteToDelete,
                })
            })
            .catch(error => {
                dispatch({
                    type: ADD_VOTE_ERROR,
                    payload: {
                        error: `Unable to save the vote, ${error}`,
                        voteWhichShouldHaveBeenDeleted: voteToDelete,
                    },
                })

                dispatch({
                    type: INCREMENT_VOTE_LOCALLY,
                    payload: {
                        vote: voteToDelete,
                        amount: 1,
                    },
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
                text: data.trim(),
            },
        },
    })

    fireStoreMainInstance
        .collection('projects')
        .doc(getProjectSelector(getState()).id)
        .collection('userVotes')
        .doc(vote.id)
        .update({
            text: data,
            updatedAt: serverTimestamp(),
        })
        .then(() => {
            dispatch({
                type: UPDATE_VOTE_SUCCESS,
                payload: {
                    vote: {
                        [vote.id]: {
                            ...vote,
                            text: data,
                        },
                    },
                },
            })
        })
        .catch(error => {
            dispatch({
                type: UPDATE_VOTE_ERROR,
                payload: {
                    error: error.toString(),
                    voteId: vote.id,
                },
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
                    payload: votes,
                })
            })
            .catch(error => {
                dispatch({
                    type: GET_USER_VOTES_ERROR,
                    payload: error,
                })
            })
    }
}

export const removeVotePostError = () => ({
    type: DELETE_VOTE_POST_ERROR,
})

export const removeVoteLoadError = () => ({
    type: DELETE_VOTE_LOAD_ERROR,
})
