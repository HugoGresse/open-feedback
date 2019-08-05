import { authProvider } from '../../firebase'
import { LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT } from './authActionTypes'
import { isLoggedSelector } from './authSelectors'
import { getVotes } from '../vote/voteActions'

export const signIn = () => {
    return (dispatch, getState) => {
        if (isLoggedSelector(getState())) {
            return
        }
        authProvider.onAuthStateChanged(user => {
            if (user) {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: user
                })

                dispatch(getVotes())
            } else {
                dispatch({
                    type: LOGOUT
                })
            }
        })

        authProvider.signInAnonymously().catch(error => {
            dispatch({
                type: LOGIN_ERROR,
                payload: error
            })
        })
    }
}
