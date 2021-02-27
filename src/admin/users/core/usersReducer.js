import {
    GET_USER_DETAILS_SUCCESS,
    USER_INVITE_ADD,
    USER_INVITE_GET_SUCCESS,
    USER_INVITE_REMOVE_SUCCESS,
    USER_INVITES_GET_SUCCESS,
    USERS_SET_FILTER,
} from './usersActionTypes'
import { SELECT_PROJECT } from '../../project/core/projectActionTypes'
import { SELECT_ORGANIZATION } from '../../organization/core/organizationActionTypes'
import { LOGOUT } from '../../auth/authActionTypes'

const initState = {
    usersData: {},
    invite: {},
    pendingInvites: [],
    filter: '',
}

const usersReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_USER_DETAILS_SUCCESS:
            return {
                ...state,
                usersData: {
                    ...state.usersData,
                    [payload.uid]: payload,
                },
            }
        case USERS_SET_FILTER:
            return {
                ...state,
                filter: payload,
            }
        case USER_INVITE_GET_SUCCESS:
            return {
                ...state,
                invite: payload,
            }
        case USER_INVITES_GET_SUCCESS:
            return {
                ...state,
                pendingInvites: payload,
            }
        case USER_INVITE_ADD:
            return {
                ...state,
                pendingInvites: [...state.pendingInvites, payload],
            }
        case USER_INVITE_REMOVE_SUCCESS:
            return {
                ...state,
                pendingInvites: state.pendingInvites.filter(
                    (invite) => invite.id !== payload
                ),
            }
        case SELECT_ORGANIZATION:
        case SELECT_PROJECT:
            return {
                ...initState,
                usersData: state.usersData,
            }
        case LOGOUT:
            return {
                ...initState,
            }
        default:
            return state
    }
}

export default usersReducer
