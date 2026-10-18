import type { Invite, User } from '../../../core/models'
import {
    GET_USER_DETAILS_SUCCESS,
    type InviteDocument,
    USER_INVITE_ADD,
    USER_INVITE_GET_SUCCESS,
    USER_INVITE_REMOVE_SUCCESS,
    USER_INVITES_GET_SUCCESS,
    type UsersAction,
    USERS_SET_FILTER,
} from './usersActionTypes'
import { SELECT_PROJECT } from '../../project/core/projectActionTypes'
import {
    SELECT_ORGANIZATION,
    type SelectOrganizationAction,
} from '../../organization/core/organizationActionTypes'
import { LOGOUT, type LogoutAction } from '../../auth/authActionTypes'

export interface UsersState {
    /** Loaded `users/{uid}` documents keyed by uid. */
    usersData: Record<string, User>
    /** The listened invite, `{}` before it is loaded. */
    invite: Partial<InviteDocument>
    pendingInvites: Invite[]
    filter: string
}

/** Only the type is read here; the project module owns the full action. */
type SelectProjectAction = { type: typeof SELECT_PROJECT }

const initState: UsersState = {
    usersData: {},
    invite: {},
    pendingInvites: [],
    filter: '',
}

export const usersReducer = (
    state: UsersState = initState,
    action:
        | UsersAction
        | SelectOrganizationAction
        | SelectProjectAction
        | LogoutAction
): UsersState => {
    switch (action.type) {
        case GET_USER_DETAILS_SUCCESS:
            return {
                ...state,
                usersData: {
                    ...state.usersData,
                    [action.payload.uid]: action.payload,
                },
            }
        case USERS_SET_FILTER:
            return {
                ...state,
                filter: action.payload,
            }
        case USER_INVITE_GET_SUCCESS:
            return {
                ...state,
                invite: action.payload,
            }
        case USER_INVITES_GET_SUCCESS:
            return {
                ...state,
                pendingInvites: action.payload,
            }
        case USER_INVITE_ADD:
            return {
                ...state,
                pendingInvites: [...state.pendingInvites, action.payload],
            }
        case USER_INVITE_REMOVE_SUCCESS: {
            const inviteId = action.payload
            return {
                ...state,
                pendingInvites: state.pendingInvites.filter(
                    (invite) => invite.id !== inviteId
                ),
            }
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
