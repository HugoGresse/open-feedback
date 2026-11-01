import type { UsersState } from './usersReducer'
import type { InviteType } from './actions/inviteUser'
import {
    ROUTE_ADMIN,
    ROUTE_EVENT_BASE,
    ROUTE_ORGANIZATION_SEGMENT,
} from '../../RoutingMap'

/**
 * What the invite dialog shows:
 * - `loading`: the invite is being read, or its email is not sent yet.
 * - `processing`: the invite is being applied, a redirect follows.
 * - `accepted`: the invite was applied, the event or organization is joined.
 * - `failed`: the invite could not be applied.
 * - `wrongAccount`: the invite was sent to another email than the signed-in one.
 * - `unavailable`: the invite does not exist anymore, or could not be read.
 */
export type InviteDialogStatus =
    | 'loading'
    | 'processing'
    | 'accepted'
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
            return 'processing'
        case 'completed':
            return 'accepted'
        case 'error':
            return 'failed'
        default:
            return 'loading'
    }
}

/** The event (project) or organization the invite gives access to, once read. */
export const getInviteDestination = (
    invite: UsersState['invite']
): { type: InviteType; id: string; name: string } | null => {
    if (typeof invite === 'string') {
        return null
    }
    if ('projectId' in invite && invite.projectId) {
        return {
            type: 'project',
            id: invite.projectId,
            name: invite.projectName ?? '',
        }
    }
    if ('organizationId' in invite && invite.organizationId) {
        return {
            type: 'organization',
            id: invite.organizationId,
            name: invite.organizationName ?? '',
        }
    }
    return null
}

/** The absolute url of the joined event or organization. */
export const getInviteDestinationUrl = ({
    type,
    id,
}: {
    type: InviteType
    id: string
}): string =>
    type === 'project'
        ? `${ROUTE_EVENT_BASE}/${id}/`
        : `${ROUTE_ADMIN}${ROUTE_ORGANIZATION_SEGMENT}/${id}/`
