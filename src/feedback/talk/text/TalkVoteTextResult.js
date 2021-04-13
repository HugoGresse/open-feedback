import React from 'react'
import { VoteTextResultItem } from './VoteTextResultItem'
import { useDispatch } from 'react-redux'
import { upVoteOnTextVoteItemVote } from '../../vote/actions/upVoteOnTextVoteItemVote'
import { useTranslation } from 'react-i18next'

const TalkVoteTextResult = ({ result, chipColors, voteItem }) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()

    return (
        <div className="comments">
            {result.map((item, key) => (
                <VoteTextResultItem
                    key={key}
                    vote={item}
                    chipColors={chipColors}
                    isLast={key === result.length - 1}
                    onVoteChange={() =>
                        dispatch(upVoteOnTextVoteItemVote(voteItem, item.id, t))
                    }
                />
            ))}
        </div>
    )
}

export default TalkVoteTextResult
