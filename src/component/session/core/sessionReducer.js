import {
    GET_SESSION_ERROR,
    GET_SESSION_SUCCESS,
    GET_SESSIONS_ERROR,
    GET_SESSIONS_SUCCESS,
    SET_SELECTED_SESSION,
    SET_SESSION_FILTER
} from './sessionActionTypes'

const initState = {
    list: {},
    filter: null,
    selected: null,
    errorSessionLoad: null,
    errorSessionsLoad: null
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
        case GET_SESSIONS_SUCCESS:
            return {
                ...state,
                list: payload
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
                errorSessionLoad: payload
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
