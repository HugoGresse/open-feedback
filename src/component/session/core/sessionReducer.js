import {
    GET_SESSION_ERROR,
    GET_SESSION_SUCCESS, SET_SESSION_FILTER
} from "./sessionActionTypes"

const initState = {
    list: {},
    filter: null
}

const sessionReducer = (state = initState, {payload, type}) => {
    switch (type) {
        case GET_SESSION_SUCCESS:
            return {
                ...state,
                list: payload
            }
        case SET_SESSION_FILTER:
            return {
                ...state,
                filter: payload
            }
        case GET_SESSION_ERROR:
            console.log(payload)
        default:
            return state
    }
}

export default sessionReducer
