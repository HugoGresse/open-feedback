import admin, { firestore } from 'firebase-admin'
import { arrayUnion, serverTimestamp } from '../../helpers/firebaseInit'
import { OrganizationRole } from '../../types/OrganizationRoles'
import FieldValue = firestore.FieldValue
import { InvitationType } from '../../types/InvitationType'

export const applyInvites = async (
    invitationId: string,
    invitationType: InvitationType,
    invitedUserId: string,
    projectIdOrOrganizationId: string,
    organizationRole?: string
) => {
    return admin
        .firestore()
        .collection(invitationType)
        .doc(projectIdOrOrganizationId)
        .update(formatUpdate(invitationType, invitedUserId, organizationRole))
        .then(() => {
            return admin
                .firestore()
                .collection('invites')
                .doc(invitationId)
                .update({
                    updatedAt: serverTimestamp(),
                    status: 'completed',
                })
        })
        .catch((error) => {
            console.log(error)
            return markInviteAsErrored(invitationId, JSON.stringify(error))
        })
}

export const markInviteAsErrored = (invitationId: string, error: string) =>
    admin.firestore().collection('invites').doc(invitationId).update({
        updatedAt: serverTimestamp(),
        status: 'error',
        error,
    })

const formatUpdate = (
    invitationType: InvitationType,
    invitedUserId: string,
    role?: string
) => {
    switch (invitationType) {
        case InvitationType.ProjectInvitationType:
            return formatProjectUpdate(invitedUserId)
        case InvitationType.OrganizationInvitationType:
            if (role) {
                return formatOrganizationUpdate(invitedUserId, role)
            }
            throw new Error('Missing role for invite')
        default:
            throw new Error('InvitationType unknown')
    }
}

const formatOrganizationUpdate = (
    invitedUserId: string,
    role: string
): { [key: string]: FieldValue | string | number } => {
    const organizationRole =
        OrganizationRole[role as keyof typeof OrganizationRole]
    switch (organizationRole) {
        case OrganizationRole.Viewer:
            return {
                viewerUserIds: arrayUnion(invitedUserId),
                updatedAt: serverTimestamp(),
            }
        case OrganizationRole.Editor:
            return {
                viewerUserIds: arrayUnion(invitedUserId),
                editorUserIds: arrayUnion(invitedUserId),
                updatedAt: serverTimestamp(),
            }
        case OrganizationRole.Admin:
            return {
                viewerUserIds: arrayUnion(invitedUserId),
                editorUserIds: arrayUnion(invitedUserId),
                adminUserIds: arrayUnion(invitedUserId),
                updatedAt: serverTimestamp(),
            }
        // No Owner: an invite must never transfer ownership
        default:
            throw new Error('Unknown role to process organization invite')
    }
}
const formatProjectUpdate = (invitedUserId: string) => ({
    members: arrayUnion(invitedUserId),
    updatedAt: serverTimestamp(),
})
