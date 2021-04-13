import { checkDateBeforeVote } from '../checkDataBeforeVote'
import { getUserSelector } from '../../auth/authSelectors'
import { ADD_VOTE_ERROR } from '../voteActionTypes'

export const isVoteAllowed = (dispatch, getState, translate) => {
    if (checkDateBeforeVote(dispatch, getState(), translate)) {
        return false
    }

    if (!getUserSelector(getState()).isAnonymous) {
        dispatch({
            type: ADD_VOTE_ERROR,
            payload: {
                error: translate('vote.adminNotAnonymous'),
            },
        })
    }
    return true
}
