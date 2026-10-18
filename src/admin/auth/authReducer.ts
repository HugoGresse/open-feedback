import {
    type AdminUser,
    type AuthAction,
    LOGIN_ERROR,
    LOGIN_SUCCESS,
    LOGOUT,
} from './authActionTypes'

export interface AuthState {
    user: AdminUser | null
    isLogin: boolean
    error: string | null | undefined
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
                error: null,
            }
        case LOGOUT:
            return {
                ...state,
                isLogin: false,
                user: null,
                error: null,
            }
        case LOGIN_ERROR:
            // biome-ignore lint/suspicious/noConsole: intentional log
            console.error(action.payload)
            return {
                ...state,
                error: action.payload,
            }
        default:
            return state
    }
}
