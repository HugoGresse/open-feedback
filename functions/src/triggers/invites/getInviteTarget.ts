import { InvitationType } from '../../types/InvitationType'
import { OrganizationRole } from '../../types/OrganizationRoles'

// Owner is never invited: ownership moves through the organization settings
const INVITABLE_ORGANIZATION_ROLES: string[] = [
    OrganizationRole.Viewer,
    OrganizationRole.Editor,
    OrganizationRole.Admin,
].map((role) => OrganizationRole[role])

export interface InviteTarget {
    type: InvitationType
    id: string
    role?: string
}

/**
 * What an invite doc applies to, or null when it is malformed: no target,
 * both a project and an organization, or an organization role that cannot be
 * invited. Invite docs are written by clients, so this must not trust them.
 */
export const getInviteTarget = (
    data: FirebaseFirestore.DocumentData
): InviteTarget | null => {
    const { projectId, organizationId, role } = data

    if (typeof projectId === 'string' && organizationId === undefined) {
        return { type: InvitationType.ProjectInvitationType, id: projectId }
    }
    if (
        typeof organizationId === 'string' &&
        projectId === undefined &&
        INVITABLE_ORGANIZATION_ROLES.includes(role)
    ) {
        return {
            type: InvitationType.OrganizationInvitationType,
            id: organizationId,
            role,
        }
    }
    return null
}
