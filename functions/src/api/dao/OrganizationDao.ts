import { App as FirebaseApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { Organization, HydratedOrganization } from '../../types/Organization'
import { NotFoundError } from '../others/Errors'
import { APIKey } from '../plugins/APIKey'
import { UserDao } from './UserDao'
import { User } from '../../types/User'

const ORGANIZATION_COLLECTION = 'organizations'
// The API key lives in a member-only private subcollection
// (organizations/{orgId}/private/integration), never on the org doc.
// Mirrors the project (event) integration.
const ORGANIZATION_PRIVATE_COLLECTION = 'private'
const ORGANIZATION_INTEGRATION_DOC = 'integration'

export class OrganizationDao {
    public static async getOrganizationFromId(
        firebaseApp: FirebaseApp,
        organizationId: string
    ): Promise<Organization> {
        const db = getFirestore(firebaseApp)
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
        firebaseApp: FirebaseApp,
        apiKey: APIKey
    ): Promise<Organization | null> {
        const db = getFirestore(firebaseApp)

        // Resolve the key from the private subcollection across all orgs.
        const snapshot = await db
            .collectionGroup(ORGANIZATION_PRIVATE_COLLECTION)
            .where('apiKey', '==', apiKey.apiKey)
            .limit(1)
            .get()

        if (snapshot.empty) {
            throw new NotFoundError('Organization not found')
        }

        const integrationDoc = snapshot.docs[0]
        // collectionGroup('private') also matches projects/{id}/private. Make
        // sure the hit is exactly organizations/{orgId}/private/integration
        // before trusting it as an organization credential.
        const organizationRef = integrationDoc.ref.parent.parent
        if (
            !organizationRef ||
            integrationDoc.ref.id !== ORGANIZATION_INTEGRATION_DOC ||
            organizationRef.parent.id !== ORGANIZATION_COLLECTION
        ) {
            throw new NotFoundError('Organization not found')
        }

        // Stamp last-used time (best effort: never fail auth on this write,
        // but surface persistent failures via a warning).
        await integrationDoc.ref
            .set(
                { apiKeyLastUsedAt: new Date().toISOString() },
                { merge: true }
            )
            .catch((error: unknown) => {
                console.warn(
                    `Failed to update apiKeyLastUsedAt for organization ${organizationRef.id}:`,
                    error
                )
            })

        const organizationDoc = await organizationRef.get()
        if (!organizationDoc.exists) {
            throw new NotFoundError('Organization not found')
        }

        return {
            id: organizationDoc.id,
            ...organizationDoc.data(),
        } as Organization
    }

    public static async hydrateOrganization(
        firebaseApp: FirebaseApp,
        organization: Organization
    ): Promise<HydratedOrganization> {
        const allUserIds = [
            organization.ownerUserId,
            ...(organization.adminUserIds || []),
            ...(organization.editorUserIds || []),
            ...(organization.viewerUserIds || []),
        ]

        const usersMap = await UserDao.getUsersByIds(firebaseApp, allUserIds)

        const getUser = (userId: string): User => {
            return (
                usersMap.get(userId) || {
                    id: userId,
                    displayName: undefined,
                    email: undefined,
                    photoUrl: undefined,
                    createdAt: undefined,
                    updatedAt: undefined,
                }
            )
        }

        const {
            ownerUserId,
            adminUserIds,
            editorUserIds,
            viewerUserIds,
            ...rest
        } = organization

        return {
            ...rest,
            ownerUser: getUser(ownerUserId),
            adminUsers: (adminUserIds || []).map(getUser),
            editorUsers: (editorUserIds || []).map(getUser),
            viewerUsers: (viewerUserIds || []).map(getUser),
        }
    }
}
