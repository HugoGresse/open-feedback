import type { UsersState } from './usersReducer'

/**
 * What the invite dialog shows:
 * - `loading`: the invite is being read, or its email is not sent yet.
 * - `processing`: the invite is being applied, a redirect follows.
 * - `failed`: the invite could not be applied.
 * - `wrongAccount`: the invite was sent to another email than the signed-in one.
 * - `unavailable`: the invite does not exist anymore, or could not be read.
 */
export type InviteDialogStatus =
    | 'loading'
    | 'processing'
    | 'failed'
    | 'wrongAccount'
    | 'unavailable'

export const getInviteDialogStatus = (
    invite: UsersState['invite']
): InviteDialogStatus => {
    if (invite === 'notAllowed') {
        return 'wrongAccount'
    }
    if (invite === 'failed') {
        return 'unavailable'
    }
    switch (invite.status) {
        case 'emailSent':
        case 'completed':
            return 'processing'
        case 'error':
            return 'failed'
        default:
            return 'loading'
    }
}
