import { isVoteAllowed } from './isVoteAllowed'
import { fireStoreMainInstance, serverTimestamp } from '../../../firebase'
import { trackUnvote, trackVote } from '../../utils/track'
import { getProjectSelector } from '../../project/projectSelectors'
import { getUserSelector } from '../../auth/authSelectors'
import {
    VOTE_STATUS_ACTIVE,
    VOTE_STATUS_DELETED,
    VOTE_TYPE_TEXT_PLUS,
} from '../../../core/contants'
import { getSelectedTalkIdSelector } from '../../talk/core/talkSelectors'
import { getCurrentUserVotesSelector } from '../voteSelectors'
import {
    ADD_VOTE_BEFORE_SUCCESS,
    ADD_VOTE_ERROR,
    ADD_VOTE_SUCCESS,
    REMOVE_VOTE_SUCCESS,
} from '../voteActionTypes'
import { INCREMENT_VOTE_LOCALLY } from '../../project/projectActionTypes'
import { getVoteId } from '../getVoteId'

/**
 The user want to "up" a message within a "text" vote items. Vote Items are the element in the form, the message is only
 one answers among others to this given voteItem. The message is thus considered as the vote below.
 */
export const upVoteOnTextVoteItemVote =
    (voteItem, vote, translate) => (dispatch, getState) => {
        if (!isVoteAllowed(dispatch, getState, translate)) {
            return
        }

        const voteId = vote.id // This is the text vote the user upvoted

        const state = getState()
        const talkId = getSelectedTalkIdSelector(state)

        const project = getProjectSelector(state)
        const projectId = project.id

        const [id] = getVoteId(voteItem, projectId, getState)

        // TODO list:
        // 2. Detect if already voted to remove plus

        const voteContent = {
            projectId: projectId,
            talkId: talkId,
            voteItemId: voteItem.id,
            id: id,
            voteId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            voteType: VOTE_TYPE_TEXT_PLUS,
            userId: getUserSelector(state).uid,
            status: VOTE_STATUS_ACTIVE,
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
                vote: {
                    ...voteContent,
                    id: voteId,
                    text: vote.text,
                    plus: 1,
                },
                amount: 1,
            },
        })

        fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .collection('userVotesdzadza')
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
            .catch((error) => {
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
                        vote: {
                            ...voteContent,
                            id: voteId,
                            text: vote.text,
                            plus: 1,
                        },
                        amount: -1,
                    },
                })
            })
    }

export const removeUpVoteOnTextVoteItemVote =
    (voteToDelete, translate) => (dispatch, getState) => {
        if (!isVoteAllowed(dispatch, getState, translate) || !voteToDelete) {
            // no voteToDelete if the user has written the initial text, the user need to delete it, not remove the up vote
            return
        }
        if (getCurrentUserVotesSelector(getState())[voteToDelete.id].pending) {
            // eslint-disable-next-line no-console
            console.info(
                'Unable to delete vote as it has not been written on the database'
            )
            return
        }

        const project = getProjectSelector(getState())

        // TODO : optimistic UI
        fireStoreMainInstance
            .collection('projects')
            .doc(project.id)
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
                // TODO : optimistic UI
                // dispatch({
                //     type: REMOVE_VOTE_SUCCESS,
                //     payload: voteToDelete,
                // })
                trackUnvote(project.name, project.id)
            })
            .catch((error) => {
                dispatch({
                    type: ADD_VOTE_ERROR,
                    payload: {
                        error: `Unable to save the vote, ${error}`,
                        voteWhichShouldHaveBeenDeleted: voteToDelete,
                    },
                })

                // dispatch({
                //     type: INCREMENT_VOTE_LOCALLY,
                //     payload: {
                //         vote: voteToDelete,
                //         amount: 1,
                //     },
                // })
            })
    }
