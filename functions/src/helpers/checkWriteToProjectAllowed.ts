import * as functions from 'firebase-functions'
import { assertUserAuthenticated } from './assertUserAuthenticated'
import { getProject } from './getProject'
import { getOrganization } from './getOrganization'
import { isOrganizationWriteAllowed } from './isOrganizationWriteAllowed'
import { CallableContext } from 'firebase-functions/lib/common/providers/https'

export const checkWriteToProjectAllowed = async (
    context: CallableContext,
    projectId: string
) => {
    const uid = assertUserAuthenticated(context)
    const project = await getProject(projectId)

    if (project.owner !== uid && !project.members.includes(uid)) {
        if (project.organizationId) {
            const organization = await getOrganization(project.organizationId)
            if (isOrganizationWriteAllowed(uid, organization)) {
                return
            }
        }

        throw new functions.https.HttpsError(
            'permission-denied',
            'Only the project members or organizations with correct rights can edit an event.'
        )
    }
}
