import type { Invite, User } from '../../../core/models'

export const GET_USER_DETAILS_SUCCESS = 'admin/users/get/success'
export const USERS_SET_FILTER = 'admin/users/filter/set'
export const USER_INVITE_GET_SUCCESS = 'admin/users/invite/get/success'
export const USER_INVITE_GET_ERROR = 'admin/users/invite/get/error'
export const USER_INVITE_ADD = 'admin/users/invite/add'
export const USER_INVITE_REMOVE_SUCCESS = 'admin/users/invite/remove/success'
export const USER_INVITES_GET_SUCCESS = 'admin/users/invites/get/success'

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
    ? Omit<T, K>
    : never

/** The `invites/{id}` document data, as listened to (without its id). */
export type InviteDocument = DistributiveOmit<Invite, 'id'>

export type UsersAction =
    | { type: typeof GET_USER_DETAILS_SUCCESS; payload: User }
    | { type: typeof USERS_SET_FILTER; payload: string }
    | { type: typeof USER_INVITE_GET_SUCCESS; payload: InviteDocument }
    | { type: typeof USER_INVITE_GET_ERROR }
    | { type: typeof USER_INVITE_ADD; payload: Invite }
    | { type: typeof USER_INVITE_REMOVE_SUCCESS; payload: string }
    | { type: typeof USER_INVITES_GET_SUCCESS; payload: Invite[] }
