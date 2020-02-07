import {
    GET_TALK_VOTES_ERROR,
    GET_TALK_VOTES_SUCCESS,
    GET_USER_VOTES_ERROR,
    GET_USER_VOTES_SUCCESS,
} from './dashboardActionTypes'
import { fireStoreMainInstance } from '../../../firebase'
import { getSelectedProjectIdSelector } from '../core/projectSelectors'
import { VOTE_TYPE_TEXT } from '../../../feedback/vote/voteReducer'
import { getVoteItemsSelector } from '../settings/votingForm/votingFormSelectors'
import { getTalksListSelector } from '../../../core/talks/talksSelectors'

export const getTalkVotes = () => {
    return async (dispatch, getState) => {
        const voteItemList = getVoteItemsSelector(getState())
        const talkList = getTalksListSelector(getState())

        try {
            const aggregatesVotesCollectionRef = fireStoreMainInstance
                .collection('projects')
                .doc(getSelectedProjectIdSelector(getState()))
                .collection('aggregatedVotes')

            const talksIds = Object.keys(talkList)

            const result = []
            for (const talkId of talksIds) {
                const voteItemResults = {}
                for (const voteItem of voteItemList) {
                    const querySnapshots = await aggregatesVotesCollectionRef
                        .doc(talkId)
                        .collection(voteItem.id)
                        .get()

                    voteItemResults[voteItem.id] =
                        voteItem.type === VOTE_TYPE_TEXT ? {} : 0

                    querySnapshots.forEach(document => {
                        if (voteItem.type === VOTE_TYPE_TEXT) {
                            voteItemResults[voteItem.id] = {
                                ...voteItemResults[voteItem.id],
                                ...document.data().votes,
                            }
                        } else {
                            voteItemResults[
                                voteItem.id
                            ] += document.data().votes
                        }
                    })
                }
                result.push({
                    id: talkId,
                    votes: voteItemResults,
                })
            }

            dispatch({
                type: GET_TALK_VOTES_SUCCESS,
                payload: result,
            })
        } catch (error) {
            dispatch({
                type: GET_TALK_VOTES_ERROR,
                payload: error.toString(),
            })
        }
    }
}

export const getUserVotes = () => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(getSelectedProjectIdSelector(getState()))
            .collection('userVotes')
            .orderBy('createdAt')
            .get()
            .then(snapshot => {
                const userVotes = []
                snapshot.forEach(doc => {
                    userVotes.push({
                        fireStoreId: doc.id,
                        ...doc.data(),
                    })
                })

                dispatch({
                    type: GET_USER_VOTES_SUCCESS,
                    payload: userVotes,
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_USER_VOTES_ERROR,
                    payload: err.toString(),
                })
            })
    }
}
