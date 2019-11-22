import {
    GET_USER_DETAILS_SUCCESS, USER_INVITE_ADD,
    USER_INVITE_GET_SUCCESS,
    USER_INVITE_REMOVE_SUCCESS,
    USER_INVITES_GET_SUCCESS,
    USERS_SET_FILTER,
} from './usersActionTypes'

const initState = {
    usersData: {},
    invite: {},
    pendingInvites: [],
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
        case USER_INVITES_GET_SUCCESS:
            return {
                ...state,
                pendingInvites: payload
            }
        case USER_INVITE_ADD:
            return {
                ...state,
                pendingInvites: [...state.pendingInvites, payload]
            }
        case USER_INVITE_REMOVE_SUCCESS:
            return {
                ...state,
                pendingInvites: state.pendingInvites.filter(invite => invite.id !== payload)
            }
        default:
            return state
    }
}

export default usersReducer
