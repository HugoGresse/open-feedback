import {
    ADD_TALK_ERROR,
    ADD_TALK_SUCCESS,
    CLEAR_TALKS,
    EDIT_TALK_ERROR,
    EDIT_TALK_SUCCESS,
    GET_TALKS_ERROR,
    GET_TALKS_LOADING,
    GET_TALKS_SUCCESS,
    REMOVE_TALK_ERROR,
    REMOVE_TALK_SUCCESS,
    SET_TALKS_FILTER,
} from './talksActionTypes'
import { GET_TALK_SUCCESS } from '../../feedback/talk/core/talkActionTypes'

const initState = {
    list: {},
    filter: null,
    errorTalksLoad: null,
    loading: false,
    loaded: false,
}

const talksReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_TALK_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    ...payload,
                },
            }
        case GET_TALKS_LOADING:
            return {
                ...state,
                loading: true,
            }
        case GET_TALKS_SUCCESS:
            return {
                ...state,
                list: payload,
                loading: false,
                loaded: true,
            }
        case SET_TALKS_FILTER:
            return {
                ...state,
                filter: payload,
            }
        case ADD_TALK_SUCCESS:
        case EDIT_TALK_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    [payload.id]: payload,
                },
            }
        case REMOVE_TALK_SUCCESS: {
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
        case ADD_TALK_ERROR:
        case EDIT_TALK_ERROR:
        case REMOVE_TALK_ERROR:
            // eslint-disable-next-line no-console
            console.error(type, payload)
            return state
        case GET_TALKS_ERROR:
            // eslint-disable-next-line no-console
            console.error(type, payload)
            return {
                ...state,
                errorTalksLoad: payload,
            }
        case CLEAR_TALKS:
            return initState
        default:
            return state
    }
}

export default talksReducer
