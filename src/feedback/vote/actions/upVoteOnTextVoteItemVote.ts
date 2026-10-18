import { isVoteAllowed } from './isVoteAllowed'
import { fireStoreMainInstance, serverTimestamp } from '../../../firebase.ts'
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
    REMOVE_VOTE_BEFORE_SUCCESS,
    REMOVE_VOTE_SUCCESS,
} from '../voteActionTypes'
import { INCREMENT_VOTE_LOCALLY } from '../../project/projectActionTypes'
import { getVoteId } from '../getVoteId'
import type { TFunction } from 'i18next'
import type { Vote, VoteItem } from '../../../core/models'
import type { AppThunk } from '../../../store'
import type { TextVoteResult } from '../../talk/core/getVoteResultSelectorSelector'

/**
 The user want to "up" a message within a "text" vote items. Vote Items are the element in the form, the message is only
 one answers among others to this given voteItem. The message is thus considered as the vote below.
 */
export const upVoteOnTextVoteItemVote =
    (
        voteItem: VoteItem,
        vote: TextVoteResult,
        translate: TFunction
    ): AppThunk =>
    (dispatch, getState) => {
        if (!isVoteAllowed(dispatch, getState, translate)) {
            return
        }

        const voteId = vote.id // This is the text vote the user up voted

        const state = getState()
        // Text vote results are only displayed on the selected talk, once
        // the project is loaded and the user logged in.
        const talkId = getSelectedTalkIdSelector(state)!

        const project = getProjectSelector(state)!
        const projectId = project.id

        const [id, existingVote] = getVoteId(
            voteItem,
            projectId,
            getState,
            null,
            voteId
        )

        const voteContent: Vote = {
            projectId: projectId,
            talkId: talkId,
            voteItemId: voteItem.id,
            id: id,
            voteId,
            createdAt: existingVote
                ? existingVote.createdAt
                : serverTimestamp(),
            updatedAt: serverTimestamp(),
            voteType: VOTE_TYPE_TEXT_PLUS,
            userId: getUserSelector(state)!.uid,
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
                        // A re-used up-vote document stays in the user votes
                        voteToRestore: existingVote,
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
    (voteToDelete: Vote | null, translate: TFunction): AppThunk =>
    (dispatch, getState) => {
        if (!isVoteAllowed(dispatch, getState, translate) || !voteToDelete) {
            // no voteToDelete if the user has written the initial text, the user need to delete it, not remove the up vote
            return
        }
        // The store entry, voteToDelete may be an older copy
        const previousVote = getCurrentUserVotesSelector(getState())[
            voteToDelete.id
        ]
        if (previousVote.pending) {
            // biome-ignore lint/suspicious/noConsole: intentional log
            console.info(
                'Unable to delete vote as it has not been written on the database'
            )
            return
        }

        const project = getProjectSelector(getState())!
        // An up-vote always references the up-voted text vote
        const upVotedVoteId = voteToDelete.voteId!

        dispatch({
            type: REMOVE_VOTE_BEFORE_SUCCESS,
            payload: voteToDelete,
        })

        dispatch({
            type: INCREMENT_VOTE_LOCALLY,
            payload: {
                vote: {
                    ...voteToDelete,
                    id: upVotedVoteId,
                    text: 'used only as type...',
                    plus: 1,
                },
                amount: -1,
            },
        })

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
                        vote: {
                            ...voteToDelete,
                            id: upVotedVoteId,
                            text: 'used only as type...',
                            plus: 1,
                        },
                        amount: 1,
                    },
                })
            })
    }
