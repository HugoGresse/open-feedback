import { LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT } from './authActionTypes'
import { isLoggedSelector } from './authSelectors'
import { authProvider } from '../../firebase'

export const didSignIn = (user, error) => {
    return (dispatch, getState) => {
        if (isLoggedSelector(getState())) {
            return
        }

        if (user) {
            if (user.isAnonymous) {
                dispatch({
                    type: LOGIN_ERROR,
                    payload: 'You cannot use the admin in anonymous mode'
                })
            } else {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: user
                })
            }
        } else {
            dispatch({
                type: LOGIN_ERROR,
                payload: error
            })
        }
    }
}

export const signOut = () => {
    return (dispatch, getState) => {
        authProvider.signOut().then(() => {
            dispatch({
                type: LOGOUT
            })
        })
    }
}
