import { getAdminStateSelector } from '../adminSelector'

export const getAuthSelector = state => getAdminStateSelector(state).adminAuth

export const isLoggedSelector = state => getAuthSelector(state).isLogin

export const getUserSelector = state => getAuthSelector(state).user

export const isUserValidSelector = state => {
    const user = getUserSelector(state)

    if (!user) {
        return false
    }

    if (!user.emailVerified && !user.phoneNumber && !user.isAnonymous) {
        return false
    }
    return true
}

export const getLoginErrorSelector = state => getAuthSelector(state).error
