import type firebase from 'firebase/compat/app'
import type { AuthUser } from '../../core/models'
import {
    type AuthAction,
    LOGIN_ERROR,
    LOGIN_SUCCESS,
    LOGOUT,
} from './authActionTypes'

export interface AuthState {
    user: AuthUser | null
    isLogin: boolean
    error: firebase.auth.Error | null
}

const initState: AuthState = {
    user: null,
    isLogin: false,
    error: null,
}

export const authReducer = (
    state: AuthState = initState,
    action: AuthAction
): AuthState => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLogin: true,
                user: action.payload,
            }
        case LOGOUT:
            return {
                ...state,
                isLogin: false,
                user: null,
            }
        case LOGIN_ERROR:
            // eslint-disable-next-line no-console
            console.error(action.payload)
            return {
                ...state,
                error: action.payload,
            }
        default:
            return state
    }
}
