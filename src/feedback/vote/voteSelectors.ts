import { createAppSelector, type RootState } from '../../store'
import { getSelectedTalkIdSelector } from '../talk/core/talkSelectors'
import { VOTE_STATUS_ACTIVE, VOTE_STATUS_HIDDEN } from '../../core/contants'
import type { Vote } from '../../core/models'

/** User votes keyed by vote item id. */
export type VotesByVoteItem = Record<string, Vote[]>

const getVotes = (state: RootState) => state.votes

export const getCurrentUserVotesSelector = (state: RootState) =>
    getVotes(state).currentUserVotes

export const getErrorVotePostSelector = (state: RootState) =>
    getVotes(state).errorVotePost

export const getErrorVotesLoadSelector = (state: RootState) =>
    getVotes(state).errorVotesLoad

//  MEMOIZED SELECTORS HERE

export const getUserVotesByTalkAndVoteItemSelector = createAppSelector(
    getCurrentUserVotesSelector,
    getSelectedTalkIdSelector,
    (votes, talkId) => {
        const result: VotesByVoteItem = {}
        Object.values(votes)
            .filter((vote) => vote.talkId === talkId)
            .forEach((vote) => {
                if (!result[vote.voteItemId]) {
                    result[vote.voteItemId] = []
                }
                result[vote.voteItemId].push(vote)
            })
        return result
    }
)

export const getActiveUserVotesByTalkAndVoteItemSelector = createAppSelector(
    getCurrentUserVotesSelector,
    (_state: RootState, talkId: string | undefined) => talkId,
    (votes, talkId) => {
        const result: VotesByVoteItem = {}
        Object.values(votes)
            .filter(
                (vote) =>
                    vote.talkId === talkId &&
                    (vote.status === VOTE_STATUS_ACTIVE ||
                        vote.status === VOTE_STATUS_HIDDEN)
            )
            .forEach((vote) => {
                // VOTE_TYPE_TEXT_PLUS may have many vote on one voteItemId, need to manage that
                if (!result[vote.voteItemId]) {
                    result[vote.voteItemId] = []
                }
                result[vote.voteItemId].push(vote)
            })
        return result
    }
)

export const getVotesByTalkSelector = createAppSelector(
    getCurrentUserVotesSelector,
    (votes) => {
        const result: Record<string, Vote> = {}
        Object.values(votes).forEach((vote) => {
            result[vote.talkId] = vote
        })
        return result
    }
)
