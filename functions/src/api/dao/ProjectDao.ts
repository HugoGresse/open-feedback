import { App as FirebaseApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { Project } from '../../types/Project'
import { NotFoundError } from '../others/Errors'
import { APIKey } from '../plugins/APIKey'

const PROJECT_COLLECTION = 'projects'
// The API key lives in a member-only private subcollection
// (projects/{projectId}/private/integration), never on the world-readable
// project doc. Mirrors the admin client write path.
const PROJECT_PRIVATE_COLLECTION = 'private'

export class ProjectDao {
    public static async getProjectFromId(
        firebaseApp: FirebaseApp,
        projectId: string
    ): Promise<Project> {
        const db = getFirestore(firebaseApp)
        const doc = await db.collection(PROJECT_COLLECTION).doc(projectId).get()

        if (!doc.exists) {
            throw new NotFoundError('Project not found')
        }

        return {
            id: doc.id,
            ...doc.data(),
        } as Project
    }

    public static async getProjectFromApiKey(
        firebaseApp: FirebaseApp,
        apiKey: APIKey
    ): Promise<Project | null> {
        const db = getFirestore(firebaseApp)

        // Resolve the key from the private subcollection across all projects.
        const snapshot = await db
            .collectionGroup(PROJECT_PRIVATE_COLLECTION)
            .where('apiKey', '==', apiKey.apiKey)
            .limit(1)
            .get()

        if (snapshot.empty) {
            throw new NotFoundError('Project not found')
        }

        const integrationDoc = snapshot.docs[0]
        // projects/{projectId}/private/{doc} -> projects/{projectId}
        const projectRef = integrationDoc.ref.parent.parent
        if (!projectRef) {
            throw new NotFoundError('Project not found')
        }

        // Stamp last-used time (best effort: never fail auth on this write).
        await integrationDoc.ref
            .set(
                { apiKeyLastUsedAt: new Date().toISOString() },
                { merge: true }
            )
            .catch(() => undefined)

        const projectDoc = await projectRef.get()
        if (!projectDoc.exists) {
            throw new NotFoundError('Project not found')
        }

        return {
            id: projectDoc.id,
            ...projectDoc.data(),
        } as Project
    }
}
