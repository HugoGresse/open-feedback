import { authProvider } from '../../firebase'
import { LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT } from './authActionTypes'
import { isLoged } from './authSelectors'

export const signIn = () => {
    return (dispatch, getState) => {
        if (isLoged(getState())) {
            return
        }
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
