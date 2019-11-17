import {
    GET_USER_DETAILS_SUCCESS, USERS_SET_FILTER,
} from './usersActionTypes'

const initState = {
    usersData: {},
    filter: ""
}

const usersReducer = (state = initState, {payload, type}) => {
    switch (type) {
        case GET_USER_DETAILS_SUCCESS:
            return {
                ...state,
                usersData: {
                    ...state.usersData,
                    [payload.uid]: payload
                }
            }
        case USERS_SET_FILTER:
            return {
                ...state,
                filter: payload
            }
        default:
            return state
    }
}

export default usersReducer
