export const getAuthSelector = state => state.auth

export const isLoggedSelector = state => getAuthSelector(state).isLogin

export const getUserSelector = state => getAuthSelector(state).user

export const getLoginErrorSelector = state => getAuthSelector(state).error
