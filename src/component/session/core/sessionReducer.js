import {
    GET_SESSION_ERROR,
    GET_SESSION_SUCCESS,
    GET_SESSIONS_ERROR,
    GET_SESSIONS_SUCCESS,
    SET_SELECTED_SESSION,
    SET_SESSION_FILTER,
    GET_SESSIONS_LOADING
} from './sessionActionTypes'

const initState = {
    list: {},
    filter: null,
    selected: null,
    errorSessionLoad: null,
    errorSessionsLoad: null,
    loading: false
}

const sessionReducer = (state = initState, { payload, type }) => {
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
        case SET_SESSION_FILTER:
            return {
                ...state,
                filter: payload
            }
        case SET_SELECTED_SESSION:
            return {
                ...state,
                selected: payload
            }
        case GET_SESSION_ERROR:
            console.error(payload)
            return {
                ...state,
                errorSessionLoad: payload,
                loading: false
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

export default sessionReducer
