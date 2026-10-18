import type { RootState } from '../../store'
import { getAdminStateSelector } from '../adminSelector'
import type { AdminUser } from './authActionTypes'
import type { AuthState } from './authReducer'

export const getAuthSelector = (state: RootState): AuthState =>
    getAdminStateSelector(state).adminAuth

export const isLoggedSelector = (state: RootState): boolean =>
    getAuthSelector(state).isLogin

export const getUserSelector = (state: RootState): AdminUser | null =>
    getAuthSelector(state).user

/**
 * Only valid while logged in: throws when there is no user, like the untyped
 * `getUserSelector(state).uid` did.
 */
export const getUserIdSelector = (state: RootState): string => {
    const user = getUserSelector(state)
    if (!user) {
        throw new TypeError('getUserIdSelector: no logged in user')
    }
    return user.uid
}

export const isUserValidSelector = (state: RootState): boolean => {
    const user = getUserSelector(state)

    if (!user) {
        return false
    }

    if (!user.emailVerified && !user.phoneNumber && !user.isAnonymous) {
        return false
    }
    return true
}

export const getLoginErrorSelector = (
    state: RootState
): string | null | undefined => getAuthSelector(state).error
