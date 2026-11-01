import type { Invite, InviteStatus, User } from '../../../core/models'
import {
    GET_USER_DETAILS_SUCCESS,
    type InviteDocument,
    type InviteReadError,
    USER_INVITE_ADD,
    USER_INVITE_GET_ERROR,
    USER_INVITE_GET_SUCCESS,
    USER_INVITE_HIDE,
    USER_INVITE_LISTEN,
    USER_INVITE_REMOVE_SUCCESS,
    USER_INVITES_GET_SUCCESS,
    USER_INVITES_LISTEN,
    type UsersAction,
    USERS_SET_FILTER,
} from './usersActionTypes'
import {
    SELECT_PROJECT,
    type SelectProjectAction,
} from '../../project/core/projectActionTypes'
import {
    SELECT_ORGANIZATION,
    type SelectOrganizationAction,
} from '../../organization/core/organizationActionTypes'
import { LOGOUT, type LogoutAction } from '../../auth/authActionTypes'

export interface UsersState {
    /** Loaded `users/{uid}` documents keyed by uid. */
    usersData: Record<string, User>
    /** The listened invite: `{}` while loading, the error when unreadable. */
    invite: Partial<InviteDocument> | InviteReadError
    /**
     * The pending invites of the selected project or organization, plus the
     * ones accepted while listed, kept until hidden to show they completed.
     */
    invites: Invite[]
    filter: string
}

const initState: UsersState = {
    usersData: {},
    invite: {},
    invites: [],
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
        case USER_INVITE_LISTEN:
            return {
                ...state,
                invite: {},
            }
        case USER_INVITE_GET_SUCCESS:
        case USER_INVITE_GET_ERROR:
            return {
                ...state,
                invite: action.payload,
            }
        case USER_INVITES_LISTEN:
            return {
                ...state,
                invites: [],
            }
        case USER_INVITES_GET_SUCCESS:
            return {
                ...state,
                invites: mergeListedInvites(state.invites, action.payload),
            }
        case USER_INVITE_ADD:
            // The invites listener may have delivered it already
            if (state.invites.some(({ id }) => id === action.payload.id)) {
                return state
            }
            return {
                ...state,
                invites: [...state.invites, action.payload],
            }
        case USER_INVITE_REMOVE_SUCCESS:
        case USER_INVITE_HIDE: {
            const inviteId = action.payload
            return {
                ...state,
                invites: state.invites.filter(
                    (invite) => invite.id !== inviteId
                ),
            }
        }
        case SELECT_ORGANIZATION:
        case SELECT_PROJECT:
            return {
                ...initState,
                usersData: state.usersData,
                // The invite dialog stays open over the joined event or
                // organization, which is then selected
                invite: state.invite,
            }
        case LOGOUT:
            return {
                ...initState,
            }
        default:
            return state
    }
}

const PENDING_INVITE_STATUSES: InviteStatus[] = ['new', 'emailSent', 'error']

/** Not accepted yet: created, its email sent, or in error. */
export const isPendingInvite = (invite: Invite) =>
    PENDING_INVITE_STATUSES.includes(invite.status)

/**
 * The invites to list from all the invites of the project or organization: an
 * accepted one is only kept when it was already listed, i.e. accepted since
 * the listen started, not the ones accepted long ago.
 */
export const mergeListedInvites = (
    listed: Invite[],
    invites: Invite[]
): Invite[] =>
    invites.filter(
        (invite) =>
            isPendingInvite(invite) || listed.some(({ id }) => id === invite.id)
    )

/** Whether an invite listed as pending is now accepted. */
export const hasJustAccepted = (listed: Invite[], invites: Invite[]) =>
    invites.some(
        (invite) =>
            invite.status === 'completed' &&
            listed.some(
                (listedInvite) =>
                    listedInvite.id === invite.id &&
                    isPendingInvite(listedInvite)
            )
    )
