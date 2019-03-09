export const getAuth = state => state.adminAuth

export const isLogged = state => getAuth(state).isLogin

export const getUserSelector = state => getAuth(state).user

export const getLoginErrorSelector = state => getAuth(state).error
