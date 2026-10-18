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
    type VoteAction,
} from './voteActionTypes'
import { fireStoreMainInstance, serverTimestamp } from '../../firebase.ts'
import { getUserSelector } from '../auth/authSelectors'
import { getProjectSelector } from '../project/projectSelectors'
import { getCurrentUserVotesSelector } from './voteSelectors'
import { INCREMENT_VOTE_LOCALLY } from '../project/projectActionTypes'
import {
    VOTE_STATUS_ACTIVE,
    VOTE_STATUS_DELETED,
    VOTE_STATUS_HIDDEN,
    VOTE_TYPE_TEXT,
} from '../../core/contants'
import { trackUnvote, trackVote } from '../utils/track'
import { getVoteId } from './getVoteId'
import { isVoteAllowed } from './actions/isVoteAllowed'
import type { TFunction } from 'react-i18next'
import type firebase from 'firebase/compat/app'
import type { Vote, VoteItem, VotesMap } from '../../core/models'
import type { AppThunk } from '../../store'

// The thunks below run from the Talk page: the project is loaded and the
// user logged in (`!` on their selectors).

export const voteFor = (
    talkId: string,
    voteItem: VoteItem,
    data: string | null,
    translate: TFunction
): AppThunk => {
    return (dispatch, getState) => {
        if (!isVoteAllowed(dispatch, getState, translate)) {
            return
        }

        const project = getProjectSelector(getState())!
        const projectId = project.id

        const [id, existingVote] = getVoteId(
            voteItem,
            projectId,
            getState,
            data
        )
        // Editing a comment hidden by the moderation keeps it hidden
        const isHidden = existingVote?.status === VOTE_STATUS_HIDDEN

        const voteContent: Vote = {
            projectId: projectId,
            talkId: talkId,
            voteItemId: voteItem.id,
            id: id,
            createdAt: existingVote
                ? existingVote.createdAt
                : serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: getUserSelector(getState())!.uid,
            status: isHidden ? VOTE_STATUS_HIDDEN : VOTE_STATUS_ACTIVE,
        }

        if (voteItem.type === VOTE_TYPE_TEXT) {
            // A text vote item always sends the text
            voteContent.text = data!.trim()
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

        if (!isHidden) {
            dispatch({
                type: INCREMENT_VOTE_LOCALLY,
                payload: {
                    vote: voteContent,
                    amount: 1,
                },
            })
        }

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
                trackVote(project.name, projectId, voteItem.type)
            })
            .catch((error: unknown) => {
                dispatch({
                    type: ADD_VOTE_ERROR,
                    payload: {
                        error: `Unable to save the vote, ${error}`,
                        voteId: voteContent.id,
                        // A re-used vote document stays in the user votes
                        voteToRestore: existingVote,
                    },
                })

                if (isHidden) {
                    return
                }
                dispatch({
                    type: INCREMENT_VOTE_LOCALLY,
                    payload:
                        existingVote?.text &&
                        existingVote.status === VOTE_STATUS_ACTIVE
                            ? // A failed edit puts the previous text back
                              { vote: existingVote, amount: 1 }
                            : { vote: voteContent, amount: -1 },
                })
            })
    }
}

export const removeVote = (
    voteToDelete: Vote,
    translate: TFunction
): AppThunk => {
    return (dispatch, getState) => {
        // The store entry, voteToDelete may be an older copy (the comment
        // field keeps the vote loaded before an edit)
        const previousVote =
            getCurrentUserVotesSelector(getState())[voteToDelete.id]
        if (previousVote.pending) {
            // eslint-disable-next-line no-console
            console.info(
                'Unable to delete vote as it has not been writed on the database'
            )
            return
        }

        if (!isVoteAllowed(dispatch, getState, translate)) {
            return
        }

        const project = getProjectSelector(getState())!

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
            .doc(getProjectSelector(getState())!.id)
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
                trackUnvote(project.name, project.id)
            })
            .catch((error: unknown) => {
                dispatch({
                    type: ADD_VOTE_ERROR,
                    payload: {
                        error: `Unable to save the vote, ${error}`,
                        voteToRestore: previousVote,
                    },
                })

                dispatch({
                    type: INCREMENT_VOTE_LOCALLY,
                    payload: {
                        vote: previousVote,
                        amount: 1,
                    },
                })
            })
    }
}

export const updateVote =
    (vote: Vote, data: string, translate: TFunction): AppThunk =>
    (dispatch, getState) => {
        if (
            !isVoteAllowed(dispatch, getState, translate) ||
            data.trim().length === 0
        ) {
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
            .doc(getProjectSelector(getState())!.id)
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
            .catch((error: Error) => {
                dispatch({
                    type: UPDATE_VOTE_ERROR,
                    payload: {
                        error: error.toString(),
                        voteId: vote.id,
                    },
                })
            })
    }

export const getVotes = (): AppThunk => {
    return (dispatch, getState) => {
        fireStoreMainInstance
            .collection('projects')
            .doc(getProjectSelector(getState())!.id)
            .collection('userVotes')
            .where('userId', '==', getUserSelector(getState())!.uid)
            .get()
            .then((voteSnapshot) => {
                const votes: VotesMap = {}
                voteSnapshot.forEach((doc) => {
                    // Firestore boundary: userVotes documents are votes.
                    votes[doc.id] = doc.data() as Vote
                    votes[doc.id].id = doc.id
                })
                dispatch({
                    type: GET_USER_VOTES_SUCCESS,
                    payload: votes,
                })
            })
            .catch((error: firebase.firestore.FirestoreError) => {
                dispatch({
                    type: GET_USER_VOTES_ERROR,
                    payload: error,
                })
            })
    }
}

export const removeVotePostError = (): VoteAction => ({
    type: DELETE_VOTE_POST_ERROR,
})

export const removeVoteLoadError = (): VoteAction => ({
    type: DELETE_VOTE_LOAD_ERROR,
})
