import { vi } from 'vitest'
import { FakeFirestore } from 'firestore-vitest'

const firestoreStub = (database: { [key: string]: any }) => {
    // Prepare namespaced classes
    function firestoreConstructor(): FakeFirestore & {
        databaseId: string
        recursiveDelete: () => void
        terminate: () => void
        listCollections: () => void
        bulkWriter: () => void
        bundle: () => void
    } {
        return new FakeFirestore(database) as any
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

export const mockFirebaseAdminApp = (database: { [key: string]: any }) => {
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

    vi.doMock('firebase-admin/firestore', () => {
        return {
            getFirestore: firestoreStub(database),
            initializeFirestore: vi.fn(),
            AggregateField: vi.fn() as unknown as any,
            AggregateQuery: vi.fn() as unknown as any,
            AggregateQuerySnapshot: vi.fn() as unknown as any,
            AggregateSpec: vi.fn() as unknown as any,
            AggregateSpecData: vi.fn(),
            AggregateType: vi.fn() as unknown as any,
            BulkWriter: vi.fn() as unknown as any,
            BulkWriterOptions: vi.fn() as unknown as any,
            BundleBuilder: vi.fn() as unknown as any,
            ChildUpdateFields: vi.fn(),
            CollectionGroup: vi.fn() as unknown as any,
            CollectionReference: vi.fn(),
            DocumentChange: vi.fn(),
            DocumentChangeType: vi.fn(),
            DocumentData: vi.fn(),
            DocumentReference: vi.fn(),
            DocumentSnapshot: vi.fn(),
            FieldPath: vi.fn() as unknown as any,
            FieldValue: vi.fn() as unknown as any,
            Filter: vi.fn() as unknown as any,
            Firestore: vi.fn(),
            FirestoreDataConverter: vi.fn(),
            GeoPoint: vi.fn(),
            GrpcStatus: vi.fn() as unknown as any,
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
            Timestamp: vi.fn() as unknown as any,
            Transaction: vi.fn(),
            UpdateData: vi.fn(),
            UnionToIntersection: vi.fn(),
            WhereFilterOp: vi.fn(),
            WithFieldValue: vi.fn(),
            WriteBatch: vi.fn(),
            WriteResult: vi.fn(),
            v1: vi.fn() as unknown as any,
            setLogFunction: vi.fn(),
        }
    })
}
