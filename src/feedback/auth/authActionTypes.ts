import type { AuthError } from 'firebase/auth'
import type { AuthUser } from '../../core/models'

export const LOGIN_SUCCESS = 'login/success'
export const LOGIN_ERROR = 'login/error'
export const LOGOUT = 'logout'

export type AuthAction =
    | { type: typeof LOGIN_SUCCESS; payload: AuthUser }
    | { type: typeof LOGIN_ERROR; payload: AuthError }
    | { type: typeof LOGOUT }
