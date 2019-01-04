import { authProvider } from '../../firebase'
import { LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT } from './authActionTypes'

export const signIn = () => {
    return (dispatch, getState) => {
        authProvider.onAuthStateChanged(user => {
            if (user) {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: user
                })
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
