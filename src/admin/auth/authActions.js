import { LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT } from './authActionTypes'
import { isLogged } from './authSelectors'

export const didSignIn = (user, error) => {
    return (dispatch, getState) => {
        if (isLogged(getState())) {
            return
        }

        if (user) {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: user
            })
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
        dispatch({
            type: LOGOUT
        })
    }
}
