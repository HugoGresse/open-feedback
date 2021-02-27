import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Project } from '../types/Project'

export const getProject = async (
    projectId: string | null
): Promise<Project> => {
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

    const project = <Project>projectDoc.data()

    if (!project) {
        throw new functions.https.HttpsError(
            'not-found',
            'Project has not been found or is empty.'
        )
    }
    return {
        ...project,
        id: projectDoc.id,
    }
}
