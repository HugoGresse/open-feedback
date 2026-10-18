import { VOTE_TYPE_TEXT_PLUS } from '../../core/contants'
import type { Vote } from '../../core/models'

const isPendingVote = (vote: Vote) => {
    if (vote.pending) {
        // eslint-disable-next-line no-console
        console.info(
            'Unable to modify a vote that has not been written on the database'
        )
        return true
    }
    return false
}

/**
 * Find the user vote document to update instead of creating a new one.
 * @param existingVotes the user votes on the vote item
 * @param data the user text vote value if adding a text vote
 * @param upVotedVoteId the text vote id when up-voting another text vote
 * @returns the vote to update, undefined when a new vote is needed
 */
export const findReusableVote = (
    existingVotes: Vote[] | undefined,
    data: string | null,
    upVotedVoteId?: string
): Vote | undefined => {
    if (!existingVotes || existingVotes.length === 0) {
        return undefined
    }

    const existingVote = data
        ? // The user is adding or updating a text vote
          existingVotes.find(
              (vote) => vote.text && vote.voteType !== VOTE_TYPE_TEXT_PLUS
          )
        : // The user is adding a boolean vote, or an up-vote on a text vote.
          // An up-vote document is only reused for the same text vote: the
          // server never decrements the previous one when its voteId changes.
          existingVotes.find(
              (vote) => !vote.text && vote.voteId === upVotedVoteId
          )

    if (existingVote && !isPendingVote(existingVote)) {
        return existingVote
    }
    return undefined
}
