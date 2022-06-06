import { getProjectSelector } from '../project/projectSelectors'
import { ADD_VOTE_ERROR } from './voteActionTypes'

export const checkDateBeforeVote = (dispatch, state, translate) => {
    const project = getProjectSelector(state)

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

export const isVoteWindowOpen = (voteStartTime, voteEndTime) => {
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
