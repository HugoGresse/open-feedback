import type { RootState } from '../../store'

export const getAuthSelector = (state: RootState) => state.auth

export const isLoggedSelector = (state: RootState) =>
    getAuthSelector(state).isLogin

export const getUserSelector = (state: RootState) => getAuthSelector(state).user

export const getLoginErrorSelector = (state: RootState) =>
    getAuthSelector(state).error
