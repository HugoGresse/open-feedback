import { App as FirebaseApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { Organization, HydratedOrganization } from '../../types/Organization'
import { NotFoundError } from '../others/Errors'
import { APIKey } from '../plugins/APIKey'
import { UserDao } from './UserDao'
import { User } from '../../types/User'

const ORGANIZATION_COLLECTION = 'organizations'

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
