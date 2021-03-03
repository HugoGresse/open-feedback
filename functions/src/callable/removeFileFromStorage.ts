import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { checkWriteToProjectAllowed } from '../helpers/checkWriteToProjectAllowed'
import { checkWriteToOrganizationAllowed } from '../helpers/checkWriteToOrganizationAllowed'

/**
 * Remove a given file from Firebase Storage. It check if the calling user has right to it before executing it.
 */
export const removeFileFromStorage = functions.https.onCall(
    async (data, context) => {
        if (data.projectId) {
            await checkWriteToProjectAllowed(context, data.projectId)
        } else {
            await checkWriteToOrganizationAllowed(context, data.organizationId)
        }

        const path = data.storageFullPath
        if (!path || path.length <= 0) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Missing required parameters.'
            )
        }

        await admin.storage().bucket().file(path).delete()

        return Promise.resolve()
    }
)
