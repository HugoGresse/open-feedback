import { getProjectSelector } from '../project/projectSelectors'
import { ADD_VOTE_ERROR } from './voteActionTypes'

export const checkDateBeforeVote = (dispatch, state) => {
    const project = getProjectSelector(state)

    const currentDate = new Date().toISOString()

    if (project.voteEndTime && project.voteEndTime < currentDate) {
        dispatch({
            type: ADD_VOTE_ERROR,
            payload: {
                error: `Unable to save the vote, the vote period has passed.`
            }
        })
        return true
    } else if (project.voteStartTime && currentDate < project.voteStartTime) {
        dispatch({
            type: ADD_VOTE_ERROR,
            payload: {
                error: `You cannot vote before the ${new Date(project.voteStartTime).toLocaleString()}.`
            }
        })
        return true
    }
    return false
}
