import { Organization } from '../types/Organization'

export const isOrganizationWriteAllowed = (
    uid: string,
    organization: Organization
): boolean => {
    if (!organization) {
        return false
    }
    if (
        organization.ownerUserId === uid ||
        organization.editorUserIds.includes(uid) ||
        organization.adminUserIds.includes(uid)
    ) {
        return true
    }
    return false
}
