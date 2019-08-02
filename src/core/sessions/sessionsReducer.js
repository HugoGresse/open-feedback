import {
    CLEAR_SESSIONS,
    GET_SESSIONS_ERROR,
    GET_SESSIONS_LOADING,
    GET_SESSIONS_SUCCESS,
    SET_SESSIONS_FILTER
} from './sessionsActionTypes'
import { GET_SESSION_SUCCESS } from '../../feedback/session/core/sessionActionTypes'

const initState = {
    list: {},
    filter: null,
    errorSessionsLoad: null,
    loading: false,
    loaded: false
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
                loading: false,
                loaded: true
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
        case CLEAR_SESSIONS:
            return initState
        default:
            return state
    }
}

export default sessionsReducer
