import {
    GET_USER_DETAILS_SUCCESS, USER_INVITE_GET_SUCCESS, USERS_SET_FILTER,
} from './usersActionTypes'

const initState = {
    usersData: {},
    invite: {},
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
        case USER_INVITE_GET_SUCCESS:
            return {
                ...state,
                invite: payload
            }
        default:
            return state
    }
}

export default usersReducer
