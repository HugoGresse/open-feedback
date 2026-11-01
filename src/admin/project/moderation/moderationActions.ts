import {
    GET_TEXT_VOTES_ERROR,
    GET_TEXT_VOTES_SUCCESS,
    HIDE_VOTE_SUCCESS,
    UNHIDE_VOTE_SUCCESS,
} from './moderationActionTypes'
import { fireStoreMainInstance } from '../../../firebase.ts'
import {
    collection,
    doc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { VOTE_STATUS_ACTIVE, VOTE_STATUS_HIDDEN } from '../../../core/contants'
import { addNotification } from '../../notification/notifcationActions'
import type { AppThunk } from '../../../store'
import type {
    AggregatedTalkVotes,
    AggregatedTextVote,
    Vote,
} from '../../../core/models'
import type {
    ModerationTextVote,
    ModerationTextVotes,
} from './moderationActionTypes'

type TalkWithTextVotes = AggregatedTalkVotes & { talkId: string }

/**
 * We first get all "active" votes from the aggregation and a second action get the hidden ones. This
 * reduce the request size on userVotes table
 *
 */
export const getTextUserVotes =
    (): AppThunk<Promise<void> | undefined> => (dispatch, getState) => {
        const projectId = getSelectedProjectIdSelector(getState())

        if (!projectId) {
            return
        }

        return getDocs(
            collection(
                fireStoreMainInstance,
                'projects',
                projectId,
                'sessionVotes'
            )
        )
            .then((snapshot) => {
                const talks: Record<string, TalkWithTextVotes> = {}
                snapshot.forEach((doc) => {
                    talks[doc.id] = {
                        talkId: doc.id,
                        ...(doc.data() as AggregatedTalkVotes),
                    } as TalkWithTextVotes
                })

                const talksWithComments: ModerationTextVotes = {}
                Object.values(talks).forEach((talk) => {
                    const comments = Object.values(talk)
                        .filter(
                            (
                                voteItemsVotes
                            ): voteItemsVotes is Record<
                                string,
                                AggregatedTextVote
                            > =>
                                typeof voteItemsVotes === 'object' &&
                                voteItemsVotes !== null
                        )
                        .map((objectData) =>
                            Object.keys(objectData)
                                .map((key) => {
                                    // Remove empty vote which are vote that has been deleted
                                    if (
                                        Object.keys(objectData[key]).length ===
                                            0 &&
                                        objectData[key].constructor === Object
                                    ) {
                                        return null
                                    }
                                    // Firestore boundary: a non-empty text vote has its timestamps
                                    return {
                                        voteId: key,
                                        talkId: talk.talkId,
                                        status: VOTE_STATUS_ACTIVE,
                                        ...objectData[key],
                                    } as ModerationTextVote
                                })
                                .filter(
                                    (item): item is ModerationTextVote => !!item
                                )
                        )

                    if (comments.length > 0) {
                        talksWithComments[talk.talkId] = comments.flat()
                    }
                })

                return talksWithComments
            })
            .then((talksWithActiveComments) => {
                return getDocs(
                    query(
                        collection(
                            fireStoreMainInstance,
                            'projects',
                            projectId,
                            'userVotes'
                        ),
                        where('status', '==', VOTE_STATUS_HIDDEN),
                        where('text', '>', '')
                    )
                )
                    .then((snapshot) => {
                        let vote: Vote
                        snapshot.forEach((doc) => {
                            vote = doc.data() as Vote
                            if (!talksWithActiveComments[vote.talkId]) {
                                talksWithActiveComments[vote.talkId] = []
                            }

                            // Firestore boundary: Vote timestamps are read back as Timestamp
                            talksWithActiveComments[vote.talkId].push({
                                voteId: doc.id,
                                ...vote,
                            } as unknown as ModerationTextVote)
                        })

                        dispatch({
                            type: GET_TEXT_VOTES_SUCCESS,
                            payload: talksWithActiveComments,
                        })
                    })
                    .catch((err: unknown) => {
                        // biome-ignore lint/suspicious/noConsole: intentional log
                        console.error(err)
                        dispatch({
                            type: GET_TEXT_VOTES_ERROR,
                            payload: String(err),
                        })
                    })
            })
            .catch((err: unknown) => {
                // biome-ignore lint/suspicious/noConsole: intentional log
                console.error(err)
                dispatch({
                    type: GET_TEXT_VOTES_ERROR,
                    payload: String(err),
                })
            })
    }

export const hideVote =
    (vote: ModerationTextVote): AppThunk<Promise<void> | undefined> =>
    (dispatch, getState) => {
        const projectId = getSelectedProjectIdSelector(getState())

        if (!projectId) {
            return
        }

        return updateDoc(
            doc(
                fireStoreMainInstance,
                'projects',
                projectId,
                'userVotes',
                vote.voteId
            ),
            {
                status: VOTE_STATUS_HIDDEN,
                updatedAt: serverTimestamp(),
                hiddenAt: serverTimestamp(),
            }
        )
            .then(() => {
                dispatch({
                    type: HIDE_VOTE_SUCCESS,
                    payload: vote,
                })
            })
            .catch((error: unknown) => {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'moderation.hideVoteFail',
                        message: String(error),
                    })
                )
            })
    }

export const unhideVote =
    (vote: ModerationTextVote): AppThunk<Promise<void> | undefined> =>
    (dispatch, getState) => {
        const projectId = getSelectedProjectIdSelector(getState())

        if (!projectId) {
            return
        }

        return updateDoc(
            doc(
                fireStoreMainInstance,
                'projects',
                projectId,
                'userVotes',
                vote.voteId
            ),
            {
                status: VOTE_STATUS_ACTIVE,
                updatedAt: serverTimestamp(),
                unhiddenAt: serverTimestamp(),
            }
        )
            .then(() => {
                dispatch({
                    type: UNHIDE_VOTE_SUCCESS,
                    payload: vote,
                })
            })
            .catch((error: unknown) => {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'moderation.unhideVoteFail',
                        message: String(error),
                    })
                )
            })
    }
