import {
    ADD_SESSION_ERROR,
    ADD_SESSION_SUCCESS,
    EDIT_SESSION_ERROR,
    EDIT_SESSION_SUCCESS,
    GET_SESSIONS_ERROR,
    GET_SESSIONS_LOADING,
    GET_SESSIONS_SUCCESS,
    REMOVE_SESSION_ERROR,
    REMOVE_SESSION_SUCCESS,
    SET_SESSIONS_FILTER,
} from './sessionsActionTypes'
import { GET_SESSION_SUCCESS } from '../../feedback/session/core/sessionActionTypes'

const initState = {
    list: {},
    filter: null,
    errorSessionsLoad: null,
    loading: false,
    loaded: false,
}

const sessionsReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_SESSION_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    ...payload,
                },
            }
        case GET_SESSIONS_LOADING:
            return {
                ...state,
                loading: true,
            }
        case GET_SESSIONS_SUCCESS:
            return {
                ...state,
                list: payload,
                loading: false,
                loaded: true,
            }
        case SET_SESSIONS_FILTER:
            return {
                ...state,
                filter: payload,
            }
        case ADD_SESSION_SUCCESS:
        case EDIT_SESSION_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    [payload.id]: payload,
                },
            }
        case REMOVE_SESSION_SUCCESS: {
            const {
                // eslint-disable-next-line no-unused-vars
                [payload.id]: value,
                ...list
            } = state.list

            return {
                ...state,
                list,
            }
        }
        case ADD_SESSION_ERROR:
        case EDIT_SESSION_ERROR:
        case REMOVE_SESSION_ERROR:
            // eslint-disable-next-line no-console
            console.error(type, payload)
            return state
        case GET_SESSIONS_ERROR:
            // eslint-disable-next-line no-console
            console.error(type, payload)
            return {
                ...state,
                errorSessionsLoad: payload,
            }
        default:
            return state
    }
}

export default sessionsReducer
