import { getProjectSelector } from '../project/projectSelectors'
import { ADD_VOTE_ERROR } from './voteActionTypes'

export const checkDateBeforeVote = (dispatch, state) => {
    const project = getProjectSelector(state)

    const currentDate = new Date().toISOString()

    if (project.voteEndTime && project.voteEndTime < currentDate) {
        dispatch({
            type: ADD_VOTE_ERROR,
            payload: {
                error: 'the vote period is passed.'
            }
        })
        return true
    } else if (project.voteStartTime && currentDate < project.voteStartTime) {
        dispatch({
            type: ADD_VOTE_ERROR,
            payload: {
                error:
                    'you cannot vote yet, wait until ' +
                    new Date(project.voteStartTime).toLocaleString() +
                    '.'
            }
        })
        return true
    }
    return false
}
