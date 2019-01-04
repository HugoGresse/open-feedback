export const getAuth = state => state.auth

export const isLogin = state => getAuth(state).isLogin

export const getUser = state => getAuth(state).user
