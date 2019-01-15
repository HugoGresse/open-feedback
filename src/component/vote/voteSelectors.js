import { createSelector } from 'reselect'
import { getSelectedSessionId } from '../session/core/sessionSelectors'

const getVotes = state => state.votes

export const getVotesSelector = state => getVotes(state).votes

//  MEMOIZED SELECTORS HERE

export const getVotesBySessionAndVoteItemSelector = createSelector(
    getVotesSelector,
    getSelectedSessionId,
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

export const getVotesBySession = createSelector(
    getVotesSelector,
    (votes, sessionId) => {
        const result = {}
        Object.values(votes).forEach(vote => {
            result[vote.sessionId] = vote
        })
        return result
    }
)
