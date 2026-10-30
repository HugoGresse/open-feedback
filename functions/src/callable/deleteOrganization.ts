import { onCall, HttpsError } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'
import { assertUserAuthenticated } from '../helpers/assertUserAuthenticated'
import { getOrganization } from '../helpers/getOrganization'

/**
 * Delete an organization: only its owner can, and only once it has no events
 * left (they must be deleted first, so no event ever points to a missing
 * organization). The organization doc is deleted first, in a transaction with
 * the events check, then its private docs (API key), invites and images.
 */
export const deleteOrganization = onCall(
    {
        timeoutSeconds: 540,
        memory: '1GiB',
    },
    async (request) => {
        const uid = assertUserAuthenticated(request)
        const organizationId: unknown = request.data?.organizationId
        if (typeof organizationId !== 'string' || !organizationId) {
            throw new HttpsError('invalid-argument', 'Missing organizationId.')
        }

        const organization = await getOrganization(organizationId)
        console.log(
            `User ${uid} has requested to delete organization ${organizationId} (${organization.name})`
        )
        if (organization.ownerUserId !== uid) {
            throw new HttpsError(
                'permission-denied',
                'Only the organization owner can delete the organization.'
            )
        }

        const db = admin.firestore()
        const organizationRef = db
            .collection('organizations')
            .doc(organizationId)

        await db.runTransaction(async (transaction) => {
            const projects = await transaction.get(
                db
                    .collection('projects')
                    .where('organizationId', '==', organizationId)
                    .limit(1)
            )
            if (!projects.empty) {
                throw new HttpsError(
                    'failed-precondition',
                    'The organization still has events, delete them first.'
                )
            }
            transaction.delete(organizationRef)
        })
        console.log(`Organization ${organizationId} deleted by ${uid}`)

        // The organization is gone: nothing can be added to it anymore (the
        // rules and the API both require it), so the leftovers are only
        // cleaned up. A failed cleanup is logged, the deletion still succeeded.
        const cleanups = await Promise.allSettled([
            db.recursiveDelete(organizationRef),
            deleteOrganizationInvites(db, organizationId),
            deleteOrganizationStorage(organizationId),
        ])
        cleanups.forEach((result) => {
            if (result.status === 'rejected') {
                console.error(
                    `Cleanup failed for deleted organization ${organizationId}`,
                    result.reason
                )
            }
        })

        return 'Delete successful'
    }
)

const deleteOrganizationInvites = async (
    db: admin.firestore.Firestore,
    organizationId: string
) => {
    const invites = await db
        .collection('invites')
        .where('organizationId', '==', organizationId)
        .get()
    const writer = db.bulkWriter()
    invites.forEach((invite) => {
        void writer.delete(invite.ref)
    })
    await writer.close()
}

const deleteOrganizationStorage = async (organizationId: string) => {
    const bucket = admin.storage().bucket()
    // Theme images, and the legacy uploads/{id} folder used before
    await Promise.all([
        bucket.deleteFiles({ prefix: `organizations/${organizationId}/` }),
        bucket.deleteFiles({ prefix: `uploads/${organizationId}/` }),
    ])
}
