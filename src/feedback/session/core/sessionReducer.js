import { GET_SESSION_ERROR, SET_SELECTED_SESSION } from './sessionActionTypes'

const initState = {
    selected: null,
    errorSessionLoad: null
}

const sessionReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case SET_SELECTED_SESSION:
            return {
                ...state,
                selected: payload
            }
        case GET_SESSION_ERROR:
            return {
                ...state,
                errorSessionLoad: payload,
                loading: false
            }

        default:
            return state
    }
}

export default sessionReducer
