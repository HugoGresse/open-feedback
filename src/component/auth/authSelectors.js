export const getAuth = state => state.auth

export const isLoged = state => getAuth(state).isLogin

export const getUser = state => getAuth(state).user
