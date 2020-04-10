import { authProvider } from '../../firebase'
import { LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT } from './authActionTypes'
import { isLoggedSelector } from './authSelectors'
import createAlert from '../../utils/alerting/createAlert'
import { ALERT_FIREBASE_QUOTA_REACHED } from '../../utils/alerting/alerts'
import { trackLogin } from '../../utils/analytics/track'

export const signIn = () => {
    return (dispatch, getState) => {
        if (isLoggedSelector(getState())) {
            return
        }
        authProvider.onAuthStateChanged((user) => {
            if (user) {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: user,
                })
                trackLogin(true)
            } else {
                dispatch({
                    type: LOGOUT,
                })
            }
        })

        if (authProvider.currentUser) {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: authProvider.currentUser,
            })
        } else {
            authProvider.signInAnonymously().catch((error) => {
                if (error.code === 'auth/too-many-requests') {
                    createAlert(ALERT_FIREBASE_QUOTA_REACHED)
                }
                dispatch({
                    type: LOGIN_ERROR,
                    payload: error,
                })
            })
        }
    }
}
