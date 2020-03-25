import { getProjectSelector } from '../project/projectSelectors'
import { ADD_VOTE_ERROR } from './voteActionTypes'

export const checkDateBeforeVote = (dispatch, state, translate) => {
    const project = getProjectSelector(state)

    const currentDate = new Date().getTime()

    if (project.voteEndTime && Date.parse(project.voteEndTime) < currentDate) {
        dispatch({
            type: ADD_VOTE_ERROR,
            payload: {
                error: translate('vote.rangePassed'),
            },
        })
        return true
    } else if (
        project.voteStartTime &&
        currentDate < Date.parse(project.voteStartTime)
    ) {
        dispatch({
            type: ADD_VOTE_ERROR,
            payload: {
                error: `${translate('vote.rangeNotReached')} ${new Date(
                    project.voteStartTime
                ).toLocaleString()}.`,
            },
        })
        return true
    }
    return false
}
