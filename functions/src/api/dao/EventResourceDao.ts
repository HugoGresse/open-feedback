import { createHash } from 'node:crypto'
import { App as FirebaseApp } from 'firebase-admin/app'
import {
    DocumentReference,
    DocumentSnapshot,
    FieldPath,
    FieldValue,
    getFirestore,
    Transaction,
} from 'firebase-admin/firestore'
import { EventResourceAccess, EventResourceKind } from '../eventResourceSchemas'
import { BadRequestError, HttpError, NotFoundError } from '../others/Errors'

const ABORTED = 10

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
                    [kind]: page.map((doc) => this.read(kind, doc)),
                    nextCursor:
                        snapshot.size > limit ? page[page.length - 1].id : null,
                }
            },
            true
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
                if (!doc.exists) throw new NotFoundError('Record not found')
                return this.read(kind, doc)
            },
            true
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
        const { id: _id, ...fields } = input
        if (kind === 'talks') fields.speakers ??= []
        let attempt = 0
        return this.transact(
            app,
            projectId,
            access,
            async (transaction, event) => {
                attempt++
                const existing = await transaction.get(ref)
                if (existing.exists) {
                    // A retried transaction can see its own commit when the
                    // first commit response was lost: that is a success.
                    if (attempt > 1 && this.matches(kind, existing, fields))
                        return { id: ref.id }
                    throw new HttpError(409, 'Record ID is already in use')
                }
                if (kind === 'talks' && input.id !== undefined)
                    await this.assertNoLeftoverVotes(transaction, event, ref.id)
                await this.validateSpeakers(transaction, event, kind, fields)
                transaction.create(ref, {
                    ...(kind === 'talks' ? { trackTitle: '', tags: [] } : {}),
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
                const previous = await transaction.get(ref)
                if (!previous.exists)
                    throw new NotFoundError('Record not found')
                const { revision, ...fields } = input
                // Writing values the record already shows is a no-op, which
                // also makes a retry after a lost commit response succeed.
                if (this.matches(kind, previous, fields)) return { id }
                if (revision !== this.revision(previous)) {
                    throw new HttpError(
                        409,
                        'Record changed; fetch it again before updating'
                    )
                }
                await this.validateSpeakers(
                    transaction,
                    event,
                    kind,
                    fields,
                    previous.data()?.speakers
                )
                transaction.update(ref, {
                    ...fields,
                    updatedAt: FieldValue.serverTimestamp(),
                })
                return { id }
            }
        )
    }

    private static async transact<T>(
        app: FirebaseApp,
        projectId: string,
        access: EventResourceAccess,
        operation: (
            transaction: Transaction,
            event: DocumentReference
        ) => Promise<T>,
        readOnly = false
    ): Promise<T> {
        const db = getFirestore(app)
        const event = db.collection('projects').doc(projectId)
        try {
            return await db.runTransaction(
                async (transaction) => {
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
                            403,
                            'Talks and speakers are managed by an external data source'
                        )
                    }
                    return operation(transaction, event)
                },
                readOnly ? { readOnly: true } : undefined
            )
        } catch (error) {
            if ((error as { code?: unknown }).code === ABORTED) {
                throw new HttpError(
                    503,
                    'Too many concurrent changes to this event; retry later'
                )
            }
            throw error
        }
    }

    private static async assertNoLeftoverVotes(
        transaction: Transaction,
        event: DocumentReference,
        talkId: string
    ) {
        const [aggregate, votes] = await Promise.all([
            transaction.get(event.collection('sessionVotes').doc(talkId)),
            transaction.get(
                event
                    .collection('userVotes')
                    .where('talkId', '==', talkId)
                    .limit(1)
            ),
        ])
        if (aggregate.exists || !votes.empty) {
            throw new HttpError(
                409,
                'Record ID still has votes from a deleted talk'
            )
        }
    }

    // Only IDs the request adds are checked: references the record already
    // holds (e.g. to a speaker deleted in the admin UI) must not block edits.
    private static async validateSpeakers(
        transaction: Transaction,
        event: DocumentReference,
        kind: EventResourceKind,
        fields: Record<string, unknown>,
        previous?: unknown
    ) {
        if (kind !== 'talks' || fields.speakers === undefined) return
        const known = new Set(Array.isArray(previous) ? previous : [])
        const added = (fields.speakers as string[]).filter(
            (id) => !known.has(id)
        )
        if (added.length === 0) return
        const speakers = await transaction.getAll(
            ...added.map((id) => event.collection('speakers').doc(id))
        )
        const missing = speakers
            .filter((doc) => !doc.exists)
            .map((doc) => doc.id)
        if (missing.length > 0)
            throw new BadRequestError(
                `A talk references unknown speakers: ${missing.join(', ')}`
            )
    }

    private static matches(
        kind: EventResourceKind,
        snapshot: DocumentSnapshot,
        fields: Record<string, unknown>
    ) {
        const current: Record<string, unknown> = this.project(
            kind,
            snapshot.data() ?? {}
        )
        return Object.entries(fields).every(
            ([key, value]) =>
                JSON.stringify(current[key]) === JSON.stringify(value)
        )
    }

    // Derived from Firestore's own update time, so it neither depends on
    // field order nor lets callers test guesses about hidden fields. The data
    // hash is only a fallback for snapshots without metadata (test doubles).
    private static revision(snapshot: DocumentSnapshot): string {
        const source = snapshot.updateTime
            ? `${snapshot.updateTime.seconds}.${snapshot.updateTime.nanoseconds}`
            : JSON.stringify(canonical(snapshot.data()))
        return createHash('sha256').update(source).digest('hex')
    }

    private static read(kind: EventResourceKind, snapshot: DocumentSnapshot) {
        return {
            id: snapshot.id,
            revision: this.revision(snapshot),
            ...this.project(kind, snapshot.data() ?? {}),
        }
    }

    // Values of the wrong type are omitted rather than coerced to strings, so
    // a read-modify-write cannot overwrite them with "[object Object]".
    private static project(
        kind: EventResourceKind,
        data: Record<string, unknown>
    ) {
        const text = (value: unknown) =>
            typeof value === 'string' ? value : undefined
        return kind === 'speakers'
            ? { name: text(data.name) }
            : {
                  title: text(data.title),
                  speakers: Array.isArray(data.speakers)
                      ? data.speakers.filter((id) => typeof id === 'string')
                      : [],
              }
    }
}

const canonical = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(canonical)
    if (value && typeof value === 'object')
        return Object.fromEntries(
            Object.keys(value)
                .sort()
                .map((key) => [
                    key,
                    canonical((value as Record<string, unknown>)[key]),
                ])
        )
    return value
}
