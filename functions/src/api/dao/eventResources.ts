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
import { HttpError, NotFoundError } from '../others/Errors'
import {
    assertEventAccess,
    assertKeyScope,
    EventAccess,
} from '../services/eventAccess'
import { PROJECT_COLLECTION } from './ProjectDao'

// Shared persistence for the event sub-resources (talks, speakers) stored in
// projects/{projectId}/{collection}. Each resource DAO supplies its collection,
// the mapping from a stored document to its public fields and, optionally,
// the defaults its documents are created with.

type Data = Record<string, unknown>

export interface EventResource<T extends Data> {
    collection: string
    map: (data: Data) => T
    // A factory so every created document gets its own arrays and objects.
    defaults?: () => Data
}

type Check = (
    transaction: Transaction,
    event: DocumentReference
) => Promise<void>

export interface CreateOptions<T extends Data> {
    id?: string
    fields: Partial<T>
    // Extra reads and validation, run in the transaction before the write.
    check?: Check
}

export interface UpdateOptions<T extends Data> {
    id: string
    revision: string
    fields: Partial<T>
    check?: (
        transaction: Transaction,
        event: DocumentReference,
        previous: Data
    ) => Promise<void>
}

// Values of the wrong type are omitted rather than coerced to strings, so a
// read-modify-write cannot overwrite them with "[object Object]".
export const textOrUndefined = (value: unknown) =>
    typeof value === 'string' ? value : undefined

export const listResources = <T extends Data>(
    app: FirebaseApp,
    projectId: string,
    access: EventAccess,
    resource: EventResource<T>,
    page: { limit: number; after?: string }
) =>
    transactEvent(
        app,
        projectId,
        access,
        async (transaction, event) => {
            let query = event
                .collection(resource.collection)
                .orderBy(FieldPath.documentId())
                .limit(page.limit + 1)
            if (page.after) query = query.startAfter(page.after)
            const snapshot = await transaction.get(query)
            const docs = snapshot.docs.slice(0, page.limit)
            return {
                items: docs.map((doc) => readResource(resource, doc)),
                nextCursor:
                    snapshot.size > page.limit
                        ? docs[docs.length - 1].id
                        : null,
            }
        },
        { readOnly: true }
    )

export const getResource = <T extends Data>(
    app: FirebaseApp,
    projectId: string,
    access: EventAccess,
    resource: EventResource<T>,
    id: string
) =>
    transactEvent(
        app,
        projectId,
        access,
        async (transaction, event) => {
            const doc = await transaction.get(
                event.collection(resource.collection).doc(id)
            )
            if (!doc.exists) throw new NotFoundError('Record not found')
            return readResource(resource, doc)
        },
        { readOnly: true }
    )

export const createResource = <T extends Data>(
    app: FirebaseApp,
    projectId: string,
    access: EventAccess,
    resource: EventResource<T>,
    { id, fields, check }: CreateOptions<T>
) => {
    // Chosen once so every transaction attempt targets the same document.
    const collection = getFirestore(app)
        .collection(PROJECT_COLLECTION)
        .doc(projectId)
        .collection(resource.collection)
    const ref = id === undefined ? collection.doc() : collection.doc(id)
    let attempt = 0
    return transactEvent(app, projectId, access, async (transaction, event) => {
        attempt++
        const existing = await transaction.get(ref)
        if (existing.exists) {
            // A retried transaction can see its own commit when the first
            // commit response was lost: that is a success.
            if (attempt > 1 && matches(resource, existing, fields))
                return { id: ref.id }
            throw new HttpError(409, 'Record ID is already in use')
        }
        await check?.(transaction, event)
        transaction.create(ref, {
            ...resource.defaults?.(),
            ...fields,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        })
        return { id: ref.id }
    })
}

export const updateResource = <T extends Data>(
    app: FirebaseApp,
    projectId: string,
    access: EventAccess,
    resource: EventResource<T>,
    { id, revision, fields, check }: UpdateOptions<T>
) =>
    transactEvent(app, projectId, access, async (transaction, event) => {
        const ref = event.collection(resource.collection).doc(id)
        const previous = await transaction.get(ref)
        if (!previous.exists) throw new NotFoundError('Record not found')
        // Writing values the record already shows is a no-op, which also
        // makes a retry after a lost commit response succeed.
        if (matches(resource, previous, fields)) return { id }
        if (revision !== revisionOf(previous)) {
            throw new HttpError(
                409,
                'Record changed; fetch it again before updating'
            )
        }
        await check?.(transaction, event, previous.data() ?? {})
        transaction.update(ref, {
            ...fields,
            updatedAt: FieldValue.serverTimestamp(),
        })
        return { id }
    })

// Contention (ABORTED) is turned into a 503 by the global error handler.
const transactEvent = <R>(
    app: FirebaseApp,
    projectId: string,
    access: EventAccess,
    operation: (
        transaction: Transaction,
        event: DocumentReference
    ) => Promise<R>,
    options: { readOnly?: boolean } = {}
): Promise<R> => {
    // Rejected before any read: a key for another event costs no I/O.
    assertKeyScope(projectId, access)
    const db = getFirestore(app)
    const event = db.collection(PROJECT_COLLECTION).doc(projectId)
    return db.runTransaction(
        async (transaction) => {
            const project = (await transaction.get(event)).data()
            assertEventAccess(projectId, access, project)
            if (project.setupType !== 'openfeedbackv1') {
                throw new HttpError(
                    403,
                    'Talks and speakers are managed by an external data source'
                )
            }
            return operation(transaction, event)
        },
        options.readOnly ? { readOnly: true } : undefined
    )
}

const readResource = <T extends Data>(
    resource: EventResource<T>,
    snapshot: DocumentSnapshot
) => ({
    id: snapshot.id,
    revision: revisionOf(snapshot),
    ...resource.map(snapshot.data() ?? {}),
})

const matches = <T extends Data>(
    resource: EventResource<T>,
    snapshot: DocumentSnapshot,
    fields: Data
) => {
    const current: Data = resource.map(snapshot.data() ?? {})
    return Object.entries(fields).every(
        ([key, value]) => JSON.stringify(current[key]) === JSON.stringify(value)
    )
}

// Derived from Firestore's own update time, so it neither depends on field
// order nor lets callers test guesses about hidden fields. The data hash is
// only a fallback for snapshots without metadata (test doubles).
const revisionOf = (snapshot: DocumentSnapshot): string => {
    const source = snapshot.updateTime
        ? `${snapshot.updateTime.seconds}.${snapshot.updateTime.nanoseconds}`
        : JSON.stringify(canonical(snapshot.data()))
    return createHash('sha256').update(source).digest('hex')
}

const canonical = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(canonical)
    if (value && typeof value === 'object')
        return Object.fromEntries(
            Object.keys(value)
                .sort()
                .map((key) => [key, canonical((value as Data)[key])])
        )
    return value
}
