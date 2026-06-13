import { assertUserAuthenticated } from './assertUserAuthenticated'
import { getProject } from './getProject'
import { getOrganization } from './getOrganization'
import { isOrganizationWriteAllowed } from './isOrganizationWriteAllowed'
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https'

export const checkWriteToProjectAllowed = async (
    request: CallableRequest,
    projectId: string
) => {
    const uid = assertUserAuthenticated(request)
    const project = await getProject(projectId)

    if (project.owner !== uid && !project.members.includes(uid)) {
        if (project.organizationId) {
            const organization = await getOrganization(project.organizationId)
            if (isOrganizationWriteAllowed(uid, organization)) {
                return
            }
        }

        throw new HttpsError(
            'permission-denied',
            'Only the project members or organizations with correct rights can edit an event.'
        )
    }
}
