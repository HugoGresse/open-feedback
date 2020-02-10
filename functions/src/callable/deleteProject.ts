import * as functions from 'firebase-functions'
// @ts-ignore
import firebaseTools from 'firebase-tools'
import * as admin from 'firebase-admin'

export const deleteProject = functions
    .runWith({
        timeoutSeconds: 540,
        memory: '2GB',
    })
    .https.onCall(async (data, context) => {
        if (!(context.auth && context.auth.token)) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'User not authentificated.'
            )
        }

        const projectId = data.projectId

        if (!projectId || projectId.length <= 0) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Missing required parameters.'
            )
        }

        console.log(
            `User ${context.auth.uid} has requested to delete projectId ${projectId}`
        )

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

        if (project.owner !== context.auth.uid) {
            throw new functions.https.HttpsError(
                'permission-denied',
                'Only the project owner can delete a project.'
            )
        }

        console.log(
            `User ${context.auth.uid} has requested to delete projectId ${projectDoc.id} and was granted`
        )

        return firebaseTools.firestore
            .delete(`/projects/${projectDoc.id}`, {
                project: process.env.GCLOUD_PROJECT,
                recursive: true,
                yes: true,
            })
            .then(() => {
                return 'Delete successful'
            })
    })
