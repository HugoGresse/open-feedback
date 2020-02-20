import {
    GET_TEXT_VOTES_ERROR,
    GET_TEXT_VOTES_SUCCESS,
    HIDE_VOTE_SUCCESS,
    UNHIDE_VOTE_SUCCESS,
} from './moderationActionTypes'
import { fireStoreMainInstance, serverTimestamp } from '../../../firebase'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { VOTE_STATUS_ACTIVE, VOTE_STATUS_HIDDEN } from '../../../core/contants'
import { ADD_NOTIFICATION } from '../../notification/notificationActionTypes'

/**
 * We first get all "active" votes from the aggregation and a second action get the hidden ones. This
 * reduce the request size on userVotes table
 *
 * @returns {function(*, *): Promise<T>}
 */
export const getTextUserVotes = () => (dispatch, getState) => {
    const projectId = getSelectedProjectIdSelector(getState())

    if (!projectId) {
        return
    }

    return fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .collection('sessionVotes')
        .get()
        .then(snapshot => {
            const talks = {}
            snapshot.forEach(doc => {
                talks[doc.id] = {
                    talkId: doc.id,
                    ...doc.data(),
                }
            })

            const talksWithComments = {}
            Object.values(talks).forEach(talk => {
                const comments = Object.values(talk)
                    .filter(
                        voteItemsVotes =>
                            typeof voteItemsVotes === 'object' &&
                            voteItemsVotes !== null
                    )
                    .map(objectData =>
                        Object.keys(objectData)
                            .map(key => {
                                // Remove empty vote which are vote that has been deleted
                                if (
                                    Object.keys(objectData[key]).length === 0 &&
                                    objectData[key].constructor === Object
                                ) {
                                    return null
                                }
                                return {
                                    voteId: key,
                                    talkId: talk.talkId,
                                    status: VOTE_STATUS_ACTIVE,
                                    ...objectData[key],
                                }
                            })
                            .filter(item => !!item)
                    )

                if (comments.length > 0) {
                    talksWithComments[talk.talkId] = comments.flat()
                }
            })

            return talksWithComments
        })
        .then(talksWithActiveComments => {
            return fireStoreMainInstance
                .collection('projects')
                .doc(projectId)
                .collection('userVotes')
                .where('status', '==', VOTE_STATUS_HIDDEN)
                .where('text', '>', '')
                .get()
                .then(snapshot => {
                    let vote
                    snapshot.forEach(doc => {
                        vote = doc.data()
                        if (!talksWithActiveComments[vote.talkId]) {
                            talksWithActiveComments[vote.talkId] = []
                        }

                        talksWithActiveComments[vote.talkId].push({
                            voteId: doc.id,
                            ...vote,
                        })
                    })

                    dispatch({
                        type: GET_TEXT_VOTES_SUCCESS,
                        payload: talksWithActiveComments,
                    })
                })
                .catch(err => {
                    // eslint-disable-next-line no-console
                    console.error(err)
                    dispatch({
                        type: GET_TEXT_VOTES_ERROR,
                        payload: err.toString(),
                    })
                })
        })
        .catch(err => {
            // eslint-disable-next-line no-console
            console.error(err)
            dispatch({
                type: GET_TEXT_VOTES_ERROR,
                payload: err.toString(),
            })
        })
}

export const hideVote = vote => (dispatch, getState) => {
    const projectId = getSelectedProjectIdSelector(getState())

    if (!projectId) {
        return
    }

    return fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .collection('userVotes')
        .doc(vote.voteId)
        .update({
            status: VOTE_STATUS_HIDDEN,
            updatedAt: serverTimestamp(),
            hiddenAt: serverTimestamp(),
        })
        .then(() => {
            dispatch({
                type: HIDE_VOTE_SUCCESS,
                payload: vote,
            })
        })
        .catch(error => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: 'Failed to hide the vote, ' + error.toString(),
                },
            })
        })
}

export const unhideVote = vote => (dispatch, getState) => {
    const projectId = getSelectedProjectIdSelector(getState())

    if (!projectId) {
        return
    }

    return fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .collection('userVotes')
        .doc(vote.voteId)
        .update({
            status: VOTE_STATUS_ACTIVE,
            updatedAt: serverTimestamp(),
            unhiddenAt: serverTimestamp(),
        })
        .then(() => {
            dispatch({
                type: UNHIDE_VOTE_SUCCESS,
                payload: vote,
            })
        })
        .catch(error => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: 'Failed to hide the vote, ' + error.toString(),
                },
            })
        })
}
