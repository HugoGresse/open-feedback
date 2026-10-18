import type firebase from 'firebase/compat/app'
import type { AuthUser } from '../../core/models'

export const LOGIN_SUCCESS = 'login/success'
export const LOGIN_ERROR = 'login/error'
export const LOGOUT = 'logout'

export type AuthAction =
    | { type: typeof LOGIN_SUCCESS; payload: AuthUser }
    | { type: typeof LOGIN_ERROR; payload: firebase.auth.Error }
    | { type: typeof LOGOUT }
