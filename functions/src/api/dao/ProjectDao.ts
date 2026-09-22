import { App as FirebaseApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { Project } from '../../types/Project'
import { Organization } from '../../types/Organization'
import { HttpError, NotFoundError } from '../others/Errors'
import { APIKey } from '../plugins/APIKey'
import { CreateEvent, UpdateEvent } from '../schemas'
import { validateEventSettings } from '../services/eventSettings'

const PROJECT_COLLECTION = 'projects'
// The API key lives in a member-only private subcollection
// (projects/{projectId}/private/integration), never on the world-readable
// project doc. Mirrors the admin client write path.
const PROJECT_PRIVATE_COLLECTION = 'private'
const PROJECT_INTEGRATION_DOC = 'integration'

export class ProjectDao {
    public static async createProject(
        firebaseApp: FirebaseApp,
        organization: Organization,
        input: CreateEvent
    ): Promise<Project> {
        const db = getFirestore(firebaseApp)
        const { id, ...settings } = input
        const collection = db.collection(PROJECT_COLLECTION)
        const ref = id ? collection.doc(id) : collection.doc()
        const project = {
            setupType: 'openfeedbackv1' as const,
            chipColors: organization.chipColors ?? ['ff5000'],
            favicon:
                organization.favicon ??
                'https://openfeedback.io/favicon-32x32.png',
            logoSmall:
                organization.logoSmall ??
                'https://openfeedback.io/android-chrome-192x192.png',
            languages: organization.languages ?? [],
            voteItems: organization.voteItems ?? [],
            disableSoloTalkRedirect:
                organization.disableSoloTalkRedirect ?? false,
            hideVotesUntilUserVote:
                organization.hideVotesUntilUserVote ?? false,
            displayFullDates: organization.displayFullDates ?? false,
            ...settings,
            organizationId: organization.id,
            owner: organization.ownerUserId,
            members: [organization.ownerUserId],
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        }
        validateEventSettings(project)

        // Admin SDK writes bypass client rules, so both documents can be
        // created atomically. create() also prevents overwriting an existing ID.
        const batch = db.batch()
        batch.create(ref, project)
        batch.create(
            ref
                .collection(PROJECT_PRIVATE_COLLECTION)
                .doc(PROJECT_INTEGRATION_DOC),
            { apiKey: APIKey.generateProjectApiKey() }
        )
        try {
            await batch.commit()
        } catch (error) {
            if ((error as { code?: number }).code === 6) {
                throw new HttpError(409, 'Event ID is already in use')
            }
            throw error
        }
        return { ...project, id: ref.id }
    }

    public static async updateProject(
        firebaseApp: FirebaseApp,
        projectId: string,
        access: { projectId: string } | { organizationId: string },
        settings: UpdateEvent
    ): Promise<Project> {
        if ('projectId' in access && access.projectId !== projectId) {
            throw new NotFoundError('Event not found')
        }
        const db = getFirestore(firebaseApp)
        const ref = db.collection(PROJECT_COLLECTION).doc(projectId)
        return db.runTransaction(async (transaction) => {
            const doc = await transaction.get(ref)
            const current = doc.data()
            // Check membership inside the transaction so moving or deleting an
            // event concurrently cannot authorize a write against stale data.
            if (
                !current ||
                ('organizationId' in access &&
                    current.organizationId !== access.organizationId)
            ) {
                throw new NotFoundError('Event not found')
            }
            const project = { ...current, ...settings, id: doc.id } as Project
            validateEventSettings(project)
            transaction.update(ref, {
                ...settings,
                updatedAt: FieldValue.serverTimestamp(),
            })
            return project
        })
    }

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
            ...doc.data(),
            id: doc.id,
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
        // collectionGroup('private') can match any `private` subcollection in
        // the database. Make sure the hit is exactly
        // projects/{projectId}/private/integration before trusting it as a
        // project credential.
        const projectRef = integrationDoc.ref.parent.parent
        if (
            !projectRef ||
            integrationDoc.ref.id !== PROJECT_INTEGRATION_DOC ||
            projectRef.parent.id !== PROJECT_COLLECTION
        ) {
            throw new NotFoundError('Project not found')
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
                    `Failed to update apiKeyLastUsedAt for project ${projectRef.id}:`,
                    error
                )
            })

        const projectDoc = await projectRef.get()
        if (!projectDoc.exists) {
            throw new NotFoundError('Project not found')
        }

        return {
            ...projectDoc.data(),
            id: projectDoc.id,
        } as Project
    }
}
