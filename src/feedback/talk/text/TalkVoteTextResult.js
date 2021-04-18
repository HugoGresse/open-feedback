import React from 'react'
import { VoteTextResultItem } from './VoteTextResultItem'
import { useDispatch, useSelector } from 'react-redux'
import {
    removeUpVoteOnTextVoteItemVote,
    upVoteOnTextVoteItemVote,
} from '../../vote/actions/upVoteOnTextVoteItemVote'
import { useTranslation } from 'react-i18next'
import { getUserSelector } from '../../auth/authSelectors'

const TalkVoteTextResult = ({
    result,
    chipColors,
    voteItem,
    currentUserVotes,
}) => {
    const user = useSelector(getUserSelector)
    const dispatch = useDispatch()
    const { t } = useTranslation()

    return (
        <ul className="comments">
            {result.map((item, key) => {
                const [isSelected, vote] = isVoteSelected(
                    currentUserVotes,
                    user,
                    item
                )
                return (
                    <VoteTextResultItem
                        key={key}
                        vote={item}
                        chipColors={chipColors}
                        isLast={key === result.length - 1}
                        isSelected={isSelected}
                        onVoteChange={() => {
                            if (isSelected) {
                                dispatch(
                                    removeUpVoteOnTextVoteItemVote(vote, t)
                                )
                            } else {
                                dispatch(
                                    upVoteOnTextVoteItemVote(
                                        voteItem,
                                        item.id,
                                        t
                                    )
                                )
                            }
                        }}
                    />
                )
            })}
        </ul>
    )
}

const isVoteSelected = (currentUserVotes, user, resultItem) => {
    if (!currentUserVotes) {
        return [false, null]
    }

    const userTextPlusVote = currentUserVotes.find(
        (vote) => vote.voteId === resultItem.id
    )
    if (userTextPlusVote) {
        // The current user vote (textPlus) on an existing vote
        return [true, userTextPlusVote]
    }

    if (resultItem.userId === user.uid) {
        // The current user was the one to submit the vote
        return [true, null]
    }

    return [false, null]
}

export default TalkVoteTextResult
