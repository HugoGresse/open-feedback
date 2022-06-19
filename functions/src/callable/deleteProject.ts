import * as functions from 'firebase-functions'
// @ts-ignore: no type declaration for firebase tools
import firebaseTools from 'firebase-tools'
import * as admin from 'firebase-admin'
import { assertUserAuthenticated } from '../helpers/assertUserAuthenticated'
import { getProject } from '../helpers/getProject'
import { Project } from '../types/Project'
import { getOrganization } from '../helpers/getOrganization'

export const deleteProject = functions
    .runWith({
        timeoutSeconds: 540,
        memory: '2GB',
    })
    .https.onCall(async (data, context) => {
        const uid = assertUserAuthenticated(context)
        const project = await getProject(data.projectId)

        console.log(
            `User ${uid} has requested to delete projectId ${data.projectId} (${project.name})`
        )

        await assertProjectDeletionGranted(project, uid)

        console.log(
            `User ${uid} has requested to delete projectId ${data.projectId} (${project.name}) and was granted`
        )

        return deleteProjectStorage(project.id)
            .then(() => {
                return deleteProjectFirestore(project.id)
            })
            .then(() => {
                return 'Delete successful'
            })
    })

const deleteProjectStorage = async (projectId: string) => {
    await admin
        .storage()
        .bucket()
        .deleteFiles({
            prefix: `uploads/${projectId}`,
        })
        .then(() => {
            console.log(`Storage deleted for project ${projectId}`)
        })
}

const deleteProjectFirestore = async (projectId: string) => {
    return firebaseTools.firestore
        .delete(`/projects/${projectId}`, {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            force: true,
            yes: true,
        })
        .then(() => {
            console.log(`Firestore deleted for project ${projectId}`)
        })
}

const assertProjectDeletionGranted = async (project: Project, uid: string) => {
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

    if (project.owner === uid) {
        return
    }

    let message = 'Only the project owner can delete a project.'
    if (project.organizationId) {
        message =
            'Only the event owner or an organization editor/admin/owner can delete this event.'
    }

    throw new functions.https.HttpsError('permission-denied', message)
}
