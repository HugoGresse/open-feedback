import {List, Record} from 'immutable'
import {
    GET_SESSION_ERROR,
    GET_SESSION_SUCCESS, SET_SESSION_FILTER
} from "./sessionActionTypes"

const initState = new Record({
    list: new List(),
    filter: null
})

const sessionReducer = (state = new initState(), { payload, type }) => {
    switch (type) {
        case GET_SESSION_SUCCESS:
            return state.merge({
                list: payload
            })
        case SET_SESSION_FILTER:
            return state.merge({
                filter: payload
            })
        case GET_SESSION_ERROR:
            console.log(payload)
        default:
            return state;
    }
};

export default sessionReducer;