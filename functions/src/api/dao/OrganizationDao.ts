import firebase from 'firebase-admin'
import { Organization } from '../../types/Organization'
import { NotFoundError } from '../others/Errors'
import { APIKey } from '../plugins/APIKey'

const ORGANIZATION_COLLECTION = 'organizations'

export class OrganizationDao {
    public static async getOrganizationFromId(
        firebaseApp: firebase.app.App,
        organizationId: string
    ): Promise<Organization> {
        const db = firebaseApp.firestore()
        const organizationDoc = await db
            .collection(ORGANIZATION_COLLECTION)
            .doc(organizationId)
            .get()

        if (!organizationDoc.exists) {
            throw new NotFoundError('Organization not found')
        }

        return {
            id: organizationDoc.id,
            ...organizationDoc.data(),
        } as Organization
    }

    public static async getOrganizationFromApiKey(
        firebaseApp: firebase.app.App,
        apiKey: APIKey
    ): Promise<Organization | null> {
        const db = firebaseApp.firestore()
        const doc = await db
            .collection(ORGANIZATION_COLLECTION)
            .where('apiKey', '==', apiKey.apiKey)
            .get()

        if (!doc || doc.empty || doc.docs.length === 0) {
            throw new NotFoundError('Organization not found')
        }

        return {
            id: doc.docs[0].id,
            ...doc.docs[0].data(),
        } as Organization
    }
}
