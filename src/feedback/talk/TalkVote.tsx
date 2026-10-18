import { TalkVoteBoolean } from './boolean/TalkVoteBoolean.tsx'
import { TalkVoteText } from './text/TalkVoteText.tsx'
import {
    VOTE_TYPE_BOOLEAN,
    VOTE_TYPE_SEPARATOR,
    VOTE_TYPE_TEXT,
    VOTE_TYPE_TITLE,
} from '../../core/contants'
import { TalkVoteTitle } from './nonVoteItem/TalkVoteTitle.tsx'
import { TalkVoteSeparator } from './nonVoteItem/TalkVoteSeparator.tsx'
import type { Vote, VoteItem } from '../../core/models'
import type { VoteResult } from './core/getVoteResultSelectorSelector'

/**
 * Called when the user votes on a vote item. `vote` is the user existing vote
 * to update or remove, `data` the text of a text vote.
 */
export type OnVoteChange = (
    voteItem: VoteItem,
    data: string | null,
    vote?: Vote | null
) => void

interface TalkVoteProps {
    voteItem: VoteItem
    /** The user votes on this vote item. */
    userVotes?: Vote[]
    voteResult: VoteResult
    chipColors?: string[]
    onVoteChange: OnVoteChange
}

export const TalkVote = ({
    voteItem,
    userVotes,
    voteResult,
    chipColors,
    onVoteChange,
}: TalkVoteProps) => {
    switch (voteItem.type) {
        default:
        case VOTE_TYPE_BOOLEAN:
            return (
                <TalkVoteBoolean
                    onVoteChange={(voteItem) => {
                        onVoteChange(voteItem, null, userVotes && userVotes[0])
                    }}
                    voteItem={voteItem}
                    isSelected={!!userVotes}
                    voteResult={
                        typeof voteResult === 'number' ? voteResult : undefined
                    }
                    chipColors={chipColors}
                />
            )
        case VOTE_TYPE_TEXT:
            return (
                <TalkVoteText
                    onVoteChange={onVoteChange}
                    voteItem={voteItem}
                    currentUserVotes={userVotes}
                    voteResult={
                        Array.isArray(voteResult) ? voteResult : undefined
                    }
                    chipColors={chipColors}
                />
            )
        case VOTE_TYPE_TITLE:
            return <TalkVoteTitle voteItem={voteItem} />
        case VOTE_TYPE_SEPARATOR:
            return <TalkVoteSeparator />
    }
}
