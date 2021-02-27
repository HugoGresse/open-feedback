import { Organization } from '../types/Organization'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

export const getOrganization = async (
    organizationId: string
): Promise<Organization> => {
    const organizationDoc = await admin
        .firestore()
        .collection('organizations')
        .doc(organizationId)
        .get()

    if (!organizationDoc.exists) {
        throw new functions.https.HttpsError(
            'not-found',
            'Organization has not been found.'
        )
    }

    const organization = <Organization>organizationDoc.data()

    return {
        ...organization,
        id: organizationDoc.id,
    }
}
