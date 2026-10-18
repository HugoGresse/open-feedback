import { VOTE_STATUS_DELETED, VOTE_TYPE_TEXT_PLUS } from '../../core/contants'
import type { Vote } from '../../core/models'

/**
 * Find the user vote document to update instead of creating a new one.
 * A vote still being written is re-used too: Firestore applies the writes of
 * a document in order, while a new document would duplicate the vote.
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

    if (data) {
        // The user is updating their text vote. A deleted one is not re-used:
        // the up-votes still pointing at it would move to the new text.
        return existingVotes.find(
            (vote) =>
                vote.text &&
                vote.voteType !== VOTE_TYPE_TEXT_PLUS &&
                vote.status !== VOTE_STATUS_DELETED
        )
    }
    // The user is adding a boolean vote, or an up-vote on a text vote. An
    // up-vote document is only re-used for the same text vote.
    return existingVotes.find(
        (vote) => !vote.text && vote.voteId === upVotedVoteId
    )
}
