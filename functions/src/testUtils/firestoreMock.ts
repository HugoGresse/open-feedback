import { vi } from 'vitest'
import { FakeFirestore } from 'firestore-vitest'
import type { FakeFirestoreDatabase } from 'firestore-vitest/mocks/firestore'

const firestoreStub = (database: FakeFirestoreDatabase) => {
    // Prepare namespaced classes
    function firestoreConstructor() {
        return new FakeFirestore(database)
    }
    firestoreConstructor.Query = FakeFirestore.Query
    firestoreConstructor.CollectionReference = FakeFirestore.CollectionReference
    firestoreConstructor.DocumentReference = FakeFirestore.DocumentReference
    firestoreConstructor.FieldValue = FakeFirestore.FieldValue
    firestoreConstructor.Timestamp = FakeFirestore.Timestamp
    firestoreConstructor.Transaction = FakeFirestore.Transaction
    firestoreConstructor.FieldPath = FakeFirestore.FieldPath

    return firestoreConstructor
}

export const mockFirebaseAdminApp = (
    database: FakeFirestoreDatabase,
    // Pass false when the spec registers its own firebase-admin/firestore
    // mock: vitest resolves queued doMocks in parallel, so two mocks of the
    // same module race and the stub could win.
    { firestore = true }: { firestore?: boolean } = {}
) => {
    vi.mock(import('firebase-admin/app'), () => {
        return {
            initializeApp: vi.fn(),
            getApps: vi.fn(() => []),
            deleteApp: vi.fn(),
            applicationDefault: vi.fn(),
            cert: vi.fn(),
            getApp: vi.fn(),
            getAppNames: vi.fn(),
            SDK_VERSION: '12.1.0',
            App: vi.fn(),
            AppOptions: vi.fn(),
            refreshToken: vi.fn(),
            FirebaseError: vi.fn(),
            FirebaseArrayIndexError: vi.fn(),
            FirebaseErrorCodes: vi.fn(),
            FirebaseErrorMessages: vi.fn(),
            FirebaseErrorNames: vi.fn(),
            FirebaseErrorStack: vi.fn(),
            FirebaseErrorToJSON: vi.fn(),
            FirebaseErrorToObject: vi.fn(),
        }
    })

    if (!firestore) return
    vi.doMock('firebase-admin/firestore', () => {
        return {
            getFirestore: firestoreStub(database),
            initializeFirestore: vi.fn(),
            AggregateField: vi.fn(),
            AggregateQuery: vi.fn(),
            AggregateQuerySnapshot: vi.fn(),
            AggregateSpec: vi.fn(),
            AggregateSpecData: vi.fn(),
            AggregateType: vi.fn(),
            BulkWriter: vi.fn(),
            BulkWriterOptions: vi.fn(),
            BundleBuilder: vi.fn(),
            ChildUpdateFields: vi.fn(),
            CollectionGroup: vi.fn(),
            CollectionReference: vi.fn(),
            DocumentChange: vi.fn(),
            DocumentChangeType: vi.fn(),
            DocumentData: vi.fn(),
            DocumentReference: vi.fn(),
            DocumentSnapshot: vi.fn(),
            FieldPath: vi.fn(),
            FieldValue: vi.fn(),
            Filter: vi.fn(),
            Firestore: vi.fn(),
            FirestoreDataConverter: vi.fn(),
            GeoPoint: vi.fn(),
            GrpcStatus: vi.fn(),
            NestedUpdateFields: vi.fn(),
            OrderByDirection: vi.fn(),
            PartialWithFieldValue: vi.fn(),
            Precondition: vi.fn(),
            Primitive: vi.fn(),
            Query: vi.fn(),
            QueryDocumentSnapshot: vi.fn(),
            QueryPartition: vi.fn(),
            QuerySnapshot: vi.fn(),
            ReadOptions: vi.fn(),
            ReadOnlyTransactionOptions: vi.fn(),
            ReadWriteTransactionOptions: vi.fn(),
            Settings: vi.fn(),
            SetOptions: vi.fn(),
            Timestamp: vi.fn(),
            Transaction: vi.fn(),
            UpdateData: vi.fn(),
            UnionToIntersection: vi.fn(),
            WhereFilterOp: vi.fn(),
            WithFieldValue: vi.fn(),
            WriteBatch: vi.fn(),
            WriteResult: vi.fn(),
            v1: vi.fn(),
            setLogFunction: vi.fn(),
        }
    })
}
