import { VoteTextResultItem } from './VoteTextResultItem.tsx'
import { useAppDispatch, useAppSelector } from '../../../store'
import {
    removeUpVoteOnTextVoteItemVote,
    upVoteOnTextVoteItemVote,
} from '../../vote/actions/upVoteOnTextVoteItemVote'
import { useTranslation } from 'react-i18next'
import { getUserSelector } from '../../auth/authSelectors'
import type { AuthUser, Vote, VoteItem } from '../../../core/models'
import type { TextVoteResult } from '../core/getVoteResultSelectorSelector'

interface TalkVoteTextResultProps {
    result: TextVoteResult[]
    chipColors?: string[]
    voteItem: VoteItem
    /** The user votes on this vote item. */
    currentUserVotes?: Vote[]
}

export const TalkVoteTextResult = ({
    result,
    chipColors,
    voteItem,
    currentUserVotes,
}: TalkVoteTextResultProps) => {
    const user = useAppSelector(getUserSelector)
    const dispatch = useAppDispatch()
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
                        currentUserId={user ? user.uid : ''}
                        onVoteChange={() => {
                            if (isSelected) {
                                dispatch(
                                    removeUpVoteOnTextVoteItemVote(vote, t)
                                )
                            } else {
                                dispatch(
                                    upVoteOnTextVoteItemVote(voteItem, item, t)
                                )
                            }
                        }}
                    />
                )
            })}
        </ul>
    )
}

const isVoteSelected = (
    currentUserVotes: Vote[] | undefined,
    user: AuthUser | null,
    resultItem: TextVoteResult
): [isSelected: boolean, vote: Vote | null] => {
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

    // The user is logged in once their votes are loaded
    if (resultItem.userId === user!.uid) {
        // The current user was the one to submit the vote
        return [true, null]
    }

    return [false, null]
}
