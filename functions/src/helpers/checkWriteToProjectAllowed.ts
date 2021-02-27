import * as functions from 'firebase-functions'
import { CallableContext } from 'firebase-functions/lib/providers/https'
import { assertUserAuthenticated } from './assertUserAuthenticated'
import { getProject } from './getProject'
import { getOrganization } from './getOrganization'

export const checkWriteToProjectAllowed = async (
    context: CallableContext,
    projectId: string
) => {
    const uid = assertUserAuthenticated(context)
    const project = await getProject(projectId)

    if (project.owner !== uid && !project.members.includes(uid)) {
        if (project.organizationId) {
            const organization = await getOrganization(project.organizationId)
            if (
                organization.ownerUserId === uid ||
                organization.editorUserIds.includes(uid) ||
                organization.adminUserIds.includes(uid)
            ) {
                return
            }
        }

        throw new functions.https.HttpsError(
            'permission-denied',
            'Only the project members or organizations with correct rights can edit an event.'
        )
    }
}
