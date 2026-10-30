import type { InviteDocument, InviteReadError } from './usersActionTypes'

/**
 * What the invite dialog shows:
 * - `loading`: the invite is being read, or its email is not sent yet.
 * - `processing`: the invite is being applied, a redirect follows.
 * - `failed`: the invite could not be applied.
 * - `wrongAccount`: the invite was sent to another email than the signed-in
 *   one (or was cancelled: both are denied by the Firestore rules alike).
 * - `unavailable`: the invite could not be read for another reason.
 */
export type InviteDialogStatus =
    | 'loading'
    | 'processing'
    | 'failed'
    | 'wrongAccount'
    | 'unavailable'

export interface InviteDialogUser {
    email: string | null
    phoneNumber: string | null
}

const isSentToUser = (destination: string, user: InviteDialogUser | null) =>
    destination.toLowerCase() === user?.email?.toLowerCase() ||
    destination === user?.phoneNumber

export const getInviteDialogStatus = (
    invite: Partial<InviteDocument> | null,
    readError: InviteReadError | null,
    user: InviteDialogUser | null
): InviteDialogStatus => {
    if (!invite) {
        return readError === 'notAllowed' ? 'wrongAccount' : 'unavailable'
    }
    if (
        invite.destinationUserInfo &&
        !isSentToUser(invite.destinationUserInfo, user)
    ) {
        return 'wrongAccount'
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
