import { App as FirebaseApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { Project } from '../../types/Project'
import { NotFoundError } from '../others/Errors'
import { APIKey } from '../plugins/APIKey'

const PROJECT_COLLECTION = 'projects'

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
        const doc = await db
            .collection(PROJECT_COLLECTION)
            .where('apiKey', '==', apiKey.apiKey)
            .get()

        if (!doc || doc.empty || doc.docs.length === 0) {
            throw new NotFoundError('Project not found')
        }

        return {
            id: doc.docs[0].id,
            ...doc.docs[0].data(),
        } as Project
    }
}
