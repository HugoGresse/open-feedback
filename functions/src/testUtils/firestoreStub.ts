import * as admin from 'firebase-admin'
import { vi } from 'vitest'

// test().firestore.makeDocumentSnapshot
export const makeDocumentSnapshot = (
    data: Record<string, unknown> | null,
    _path: string
) => {
    return {
        ...data,
        data: () => data,
    }
}

// Used for specific event ... in tests
export const makeDocumentSnapshot2 = (
    data: Record<string, unknown> | null,
    _path: string
) => {
    return {
        data: data,
    }
}

export const getFirestoreMocksAndInit = () => {
    const collection = vi.fn((_path: string) => {
        return {
            where,
            limit,
            doc,
        }
    })

    const doc = vi.fn(() => {
        return {
            get,
            set,
            update,
            onSnapshot,
        }
    })

    const where: (
        firstTerm: string,
        operator: string,
        secondTerm: string
    ) => {
        get: () => Promise<unknown>
        set: () => Promise<unknown>
        update: () => Promise<unknown>
        onSnapshot: () => Promise<unknown>
    } = vi.fn(() => {
        return {
            where,
            limit,
            get,
            set,
            update,
            onSnapshot,
        }
    })

    const limit = vi.fn((_limitCount: number) => {
        return {
            get,
            set,
            update,
            onSnapshot,
        }
    })

    const get = vi.fn((): Promise<unknown> => Promise.resolve(true))
    const set = vi.fn((): Promise<unknown> => Promise.resolve(true))
    const update = vi.fn((): Promise<unknown> => Promise.resolve(true))
    const onSnapshot = vi.fn((): Promise<unknown> => Promise.resolve(true))

    const firestoreStub = vi.fn(() => ({
        collection,
        // Called by the test SDK to turn event data into a snapshot.
        snapshot_: (proto: {
            fields: Record<string, { stringValue?: string }>
        }) => {
            return {
                data: () => {
                    const newObj: Record<string, string | undefined> = {}
                    Object.keys(proto.fields).forEach((key: string) => {
                        const field = proto.fields[key]
                        newObj[key] = field.stringValue
                    })

                    return newObj
                },
            }
        },
    }))

    replaceFirestoreByStub(firestoreStub)

    return {
        firestoreStub,
        collection,
        doc,
        where,
        get,
        set,
        update,
        onSnapshot,
    }
}

export const replaceFirestoreByStub = (stub: unknown) => {
    Object.defineProperty(admin, 'firestore', {
        get: () => stub,
        configurable: true,
    })
}
