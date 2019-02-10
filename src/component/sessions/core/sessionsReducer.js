import {
    GET_SESSION_SUCCESS,
    GET_SESSIONS_ERROR,
    GET_SESSIONS_SUCCESS,
    SET_SESSIONS_FILTER,
    GET_SESSIONS_LOADING
} from './sessionsActionTypes'

const initState = {
    list: {},
    filter: null,
    errorSessionsLoad: null,
    loading: false
}

const sessionsReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_SESSION_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    ...payload
                }
            }
        case GET_SESSIONS_LOADING:
            return {
                ...state,
                loading: true
            }
        case GET_SESSIONS_SUCCESS:
            return {
                ...state,
                list: payload,
                loading: false
            }
        case SET_SESSIONS_FILTER:
            return {
                ...state,
                filter: payload
            }
        case GET_SESSIONS_ERROR:
            console.error(payload)
            return {
                ...state,
                errorSessionsLoad: payload
            }
        default:
            return state
    }
}

export default sessionsReducer
