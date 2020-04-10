import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { CallableContext } from 'firebase-functions/lib/providers/https'

export const checkWriteToProjectAllowed = async (
    context: CallableContext,
    projectId: string
) => {
    if (!(context.auth && context.auth.token)) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User not authentificated.'
        )
    }

    if (!projectId || projectId.length <= 0) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Missing required parameters.'
        )
    }

    const projectDoc = await admin
        .firestore()
        .collection('projects')
        .doc(projectId)
        .get()

    if (!projectDoc.exists) {
        throw new functions.https.HttpsError(
            'not-found',
            'Project has not been found.'
        )
    }

    const project = projectDoc.data()

    if (!project) {
        throw new functions.https.HttpsError(
            'not-found',
            'Project has not been found or is empty.'
        )
    }

    if (
        project.owner !== context.auth.uid ||
        !project.members.includes(context.auth.uid)
    ) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'Only the project members can edit a project.'
        )
    }
}
