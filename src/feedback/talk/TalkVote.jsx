import React from 'react'
import TalkVoteBoolean from './boolean/TalkVoteBoolean.jsx'
import { TalkVoteText } from './text/TalkVoteText.jsx'
import { VOTE_TYPE_BOOLEAN, VOTE_TYPE_TEXT } from '../../core/contants'

export const TalkVote = ({
    voteItem,
    userVotes,
    voteResult,
    chipColors,
    onVoteChange,
}) => {
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
                    voteResult={voteResult}
                    chipColors={chipColors}
                />
            )
        case VOTE_TYPE_TEXT:
            return (
                <TalkVoteText
                    onVoteChange={onVoteChange}
                    voteItem={voteItem}
                    currentUserVotes={userVotes}
                    voteResult={voteResult}
                    chipColors={chipColors}
                />
            )
    }
}
