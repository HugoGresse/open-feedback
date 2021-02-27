import * as functions from 'firebase-functions'
import { CallableContext } from 'firebase-functions/lib/providers/https'
import { assertUserAuthenticated } from './assertUserAuthenticated'
import { getProject } from './getProject'

export const checkWriteToProjectAllowed = async (
    context: CallableContext,
    projectId: string
) => {
    const uid = assertUserAuthenticated(context)
    const project = await getProject(projectId)

    if (project.owner !== uid && !project.members.includes(uid)) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only the project members can edit a project.'
        )
    }
}
