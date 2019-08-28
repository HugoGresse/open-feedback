import { getAdminStateSelector } from '../adminSelector'

export const getAuthSelector = state => getAdminStateSelector(state).adminAuth

export const isLoggedSelector = state => getAuthSelector(state).isLogin

export const getUserSelector = state => getAuthSelector(state).user

export const getLoginErrorSelector = state => getAuthSelector(state).error
