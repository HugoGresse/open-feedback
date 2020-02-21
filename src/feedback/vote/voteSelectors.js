import { createSelector } from 'reselect'
import { getSelectedTalkIdSelector } from '../talk/core/talkSelectors'
import { VOTE_STATUS_ACTIVE, VOTE_STATUS_HIDDEN } from '../../core/contants'

const getVotes = state => state.votes

export const getCurrentUserVotesSelector = state =>
    getVotes(state).currentUserVotes

export const getErrorVotePostSelector = state => getVotes(state).errorVotePost

export const getErrorVotesLoadSelector = state => getVotes(state).errorVotesLoad

//  MEMOIZED SELECTORS HERE

export const getUserVotesByTalkAndVoteItemSelector = createSelector(
    getCurrentUserVotesSelector,
    getSelectedTalkIdSelector,
    (votes, talkId) => {
        const result = {}
        Object.values(votes)
            .filter(vote => vote.talkId === talkId)
            .forEach(vote => {
                result[vote.voteItemId] = vote
            })
        return result
    }
)

export const getActiveUserVotesByTalkAndVoteItemSelector = createSelector(
    getCurrentUserVotesSelector,
    getSelectedTalkIdSelector,
    (votes, talkId) => {
        const result = {}
        Object.values(votes)
            .filter(
                vote =>
                    vote.talkId === talkId &&
                    (vote.status === VOTE_STATUS_ACTIVE ||
                        vote.status === VOTE_STATUS_HIDDEN)
            )
            .forEach(vote => {
                result[vote.voteItemId] = vote
            })
        return result
    }
)

export const getVotesByTalkSelector = createSelector(
    getCurrentUserVotesSelector,
    votes => {
        const result = {}
        Object.values(votes).forEach(vote => {
            result[vote.talkId] = vote
        })
        return result
    }
)
