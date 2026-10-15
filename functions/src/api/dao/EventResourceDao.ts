import { createHash } from 'node:crypto'
import { App as FirebaseApp } from 'firebase-admin/app'
import {
    DocumentReference,
    FieldPath,
    FieldValue,
    getFirestore,
    Transaction,
} from 'firebase-admin/firestore'
import { EventResourceAccess, EventResourceKind } from '../eventResourceSchemas'
import { BadRequestError, HttpError, NotFoundError } from '../others/Errors'

export class EventResourceDao {
    static list(
        app: FirebaseApp,
        projectId: string,
        access: EventResourceAccess,
        kind: EventResourceKind,
        limit: number,
        after?: string
    ) {
        return this.transact(
            app,
            projectId,
            access,
            async (transaction, event) => {
                let query = event
                    .collection(kind)
                    .orderBy(FieldPath.documentId())
                    .limit(limit + 1)
                if (after) query = query.startAfter(after)
                const snapshot = await transaction.get(query)
                const page = snapshot.docs.slice(0, limit)
                return {
                    id: projectId,
                    [kind]: page.map((doc) =>
                        this.project(kind, doc.id, doc.data())
                    ),
                    nextCursor:
                        snapshot.size > limit ? page[page.length - 1].id : null,
                }
            }
        )
    }

    static get(
        app: FirebaseApp,
        projectId: string,
        access: EventResourceAccess,
        kind: EventResourceKind,
        id: string
    ) {
        return this.transact(
            app,
            projectId,
            access,
            async (transaction, event) => {
                const doc = await transaction.get(
                    event.collection(kind).doc(id)
                )
                const data = doc.data()
                if (!data) throw new NotFoundError('Record not found')
                return this.project(kind, doc.id, data)
            }
        )
    }

    static create(
        app: FirebaseApp,
        projectId: string,
        access: EventResourceAccess,
        kind: EventResourceKind,
        input: Record<string, unknown>
    ) {
        const db = getFirestore(app)
        const collection = db
            .collection('projects')
            .doc(projectId)
            .collection(kind)
        const ref =
            input.id === undefined
                ? collection.doc()
                : collection.doc(input.id as string)
        return this.transact(
            app,
            projectId,
            access,
            async (transaction, event) => {
                const existing = await transaction.get(ref)
                if (existing.exists)
                    throw new HttpError(409, 'Record ID is already in use')
                const { id: _id, ...fields } = input
                if (kind === 'talks') fields.speakers ??= []
                await this.validateSpeakers(transaction, event, kind, fields)
                transaction.create(ref, {
                    ...fields,
                    createdAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp(),
                })
                return { id: ref.id }
            }
        )
    }

    static update(
        app: FirebaseApp,
        projectId: string,
        access: EventResourceAccess,
        kind: EventResourceKind,
        id: string,
        input: Record<string, unknown>
    ) {
        return this.transact(
            app,
            projectId,
            access,
            async (transaction, event) => {
                const ref = event.collection(kind).doc(id)
                const previous = (await transaction.get(ref)).data()
                if (!previous) throw new NotFoundError('Record not found')
                const { revision, ...fields } = input
                if (revision !== this.revision(previous)) {
                    throw new HttpError(
                        409,
                        'Record changed; fetch it again before updating'
                    )
                }
                await this.validateSpeakers(transaction, event, kind, fields)
                const unchanged = Object.entries(fields).every(
                    ([key, value]) =>
                        JSON.stringify(previous[key]) === JSON.stringify(value)
                )
                if (!unchanged) {
                    transaction.update(ref, {
                        ...fields,
                        updatedAt: FieldValue.serverTimestamp(),
                    })
                }
                return { id }
            }
        )
    }

    private static transact<T>(
        app: FirebaseApp,
        projectId: string,
        access: EventResourceAccess,
        operation: (
            transaction: Transaction,
            event: DocumentReference
        ) => Promise<T>
    ): Promise<T> {
        const db = getFirestore(app)
        const event = db.collection('projects').doc(projectId)
        return db.runTransaction(async (transaction) => {
            if ('projectId' in access && access.projectId !== projectId)
                throw new NotFoundError('Event not found')
            const project = (await transaction.get(event)).data()
            if (
                !project ||
                ('organizationId' in access &&
                    project.organizationId !== access.organizationId)
            ) {
                throw new NotFoundError('Event not found')
            }
            if (project.setupType !== 'openfeedbackv1') {
                throw new HttpError(
                    409,
                    'Talks and speakers are managed by an external data source'
                )
            }
            return operation(transaction, event)
        })
    }

    private static async validateSpeakers(
        transaction: Transaction,
        event: DocumentReference,
        kind: EventResourceKind,
        fields: Record<string, unknown>
    ) {
        if (kind !== 'talks' || fields.speakers === undefined) return
        for (const id of fields.speakers as string[]) {
            const speaker = await transaction.get(
                event.collection('speakers').doc(id)
            )
            if (!speaker.exists)
                throw new BadRequestError(
                    'A talk references an unknown speaker'
                )
        }
    }

    private static revision(data: Record<string, unknown>): string {
        return createHash('sha256').update(JSON.stringify(data)).digest('hex')
    }

    private static project(
        kind: EventResourceKind,
        id: string,
        data: Record<string, unknown>
    ) {
        return {
            id,
            revision: this.revision(data),
            ...(kind === 'speakers'
                ? { name: data.name }
                : { title: data.title, speakers: data.speakers ?? [] }),
        }
    }
}
