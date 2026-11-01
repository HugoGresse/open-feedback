import type { VotesByVoteItem } from '../../vote/voteSelectors'

/** Whether the user had voted on a talk when its vote page loaded. */
export interface VotedOnTalkAtLoad {
    talkId: string
    voted: boolean
}

/**
 * The "voted at load" snapshot of the talk, taken once per talk page load:
 * the votes cast during the visit don't change it. `null` until the user
 * votes are loaded (or failed to load), so an early render doesn't wrongly
 * mark "not voted".
 */
export const snapshotVotedOnTalkAtLoad = (
    previous: VotedOnTalkAtLoad | null,
    talkId: string,
    userVotesSettled: boolean,
    userTalkVotes: VotesByVoteItem
): VotedOnTalkAtLoad | null => {
    if (previous?.talkId === talkId) {
        return previous
    }
    if (!userVotesSettled) {
        return null
    }
    return {
        talkId,
        voted: Object.values(userTalkVotes).some((votes) => votes.length > 0),
    }
}

interface VoteResultsVisibilityParams {
    hideVotesUntilUserVote: boolean | undefined
    /** The `displayVotes` URL query parameter. */
    displayVotes: string | null
    /** Whether the user had voted on the talk when its page loaded. */
    votedOnTalkAtLoad: boolean
    voteWindowOpen: boolean
}

/**
 * Whether the vote results (counts and other users comments) of a talk are
 * shown. With `hideVotesUntilUserVote`, they stay hidden during the vote
 * window until the user loads the talk again after voting on it, so a first
 * vote doesn't bias the next ones.
 */
export const shouldShowVoteResults = ({
    hideVotesUntilUserVote,
    displayVotes,
    votedOnTalkAtLoad,
    voteWindowOpen,
}: VoteResultsVisibilityParams): boolean =>
    !hideVotesUntilUserVote ||
    !!displayVotes ||
    votedOnTalkAtLoad ||
    !voteWindowOpen
