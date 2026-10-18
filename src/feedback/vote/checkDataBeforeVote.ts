import type { TFunction } from 'i18next'
import { getProjectSelector } from '../project/projectSelectors'
import { ADD_VOTE_ERROR } from './voteActionTypes'
import type { AppDispatch, RootState } from '../../store'

/** `[true]` when open, else `[false, translation key, start date?]`. */
export type VoteWindowState =
    [isOpen: true] | [isOpen: false, reason: string, date?: string]

export const checkDateBeforeVote = (
    dispatch: AppDispatch,
    state: RootState,
    translate: TFunction
) => {
    // Votes are only possible once the project is loaded.
    const project = getProjectSelector(state)!

    const [isOpen, reason, date] = isVoteWindowOpen(
        project.voteStartTime,
        project.voteEndTime
    )

    if (isOpen) {
        return false
    }

    dispatch({
        type: ADD_VOTE_ERROR,
        payload: {
            error: translate(reason) + (date ? ` ${date}` : ''),
        },
    })
    return true
}

export const isVoteWindowOpen = (
    voteStartTime: string | null | undefined,
    voteEndTime: string | null | undefined
): VoteWindowState => {
    const currentDate = new Date().getTime()

    if (voteEndTime && Date.parse(voteEndTime) < currentDate) {
        return [false, 'vote.rangePassed']
    } else if (voteStartTime && currentDate < Date.parse(voteStartTime)) {
        return [
            false,
            'vote.rangeNotReached',
            new Date(voteStartTime).toLocaleString(),
        ]
    }
    return [true]
}
