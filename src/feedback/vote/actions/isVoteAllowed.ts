import type { TFunction } from 'react-i18next'
import { checkDateBeforeVote } from '../checkDataBeforeVote'
import { getUserSelector } from '../../auth/authSelectors'
import { ADD_VOTE_ERROR } from '../voteActionTypes'
import type { AppDispatch, RootState } from '../../../store'

export const isVoteAllowed = (
    dispatch: AppDispatch,
    getState: () => RootState,
    translate: TFunction
) => {
    if (checkDateBeforeVote(dispatch, getState(), translate)) {
        return false
    }

    // A vote clicked before the anonymous sign-in resolves has no user yet.
    const user = getUserSelector(getState())
    if (!user) {
        dispatch({
            type: ADD_VOTE_ERROR,
            payload: {
                error: translate('vote.notLoggedIn'),
            },
        })
        return false
    }

    if (!user.isAnonymous) {
        dispatch({
            type: ADD_VOTE_ERROR,
            payload: {
                error: translate('vote.adminNotAnonymous'),
            },
        })
    }
    return true
}
