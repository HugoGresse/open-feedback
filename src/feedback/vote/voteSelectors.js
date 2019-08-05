import { createSelector } from 'reselect'
import { getSelectedSessionIdSelector } from '../session/core/sessionSelectors'

const getVotes = state => state.votes

export const getCurrentUserVotesSelector = state =>
    getVotes(state).currentUserVotes

export const getErrorVotePostSelector = state => getVotes(state).errorVotePost

export const getErrorVotesLoadSelector = state => getVotes(state).errorVotesLoad

//  MEMOIZED SELECTORS HERE

export const getUserVotesBySessionAndVoteItemSelector = createSelector(
    getCurrentUserVotesSelector,
    getSelectedSessionIdSelector,
    (votes, sessionId) => {
        const result = {}
        Object.values(votes)
            .filter(vote => vote.sessionId === sessionId)
            .forEach(vote => {
                result[vote.voteItemId] = vote
            })
        return result
    }
)

export const getVotesBySessionSelector = createSelector(
    getCurrentUserVotesSelector,
    (votes, sessionId) => {
        const result = {}
        Object.values(votes).forEach(vote => {
            result[vote.sessionId] = vote
        })
        return result
    }
)
