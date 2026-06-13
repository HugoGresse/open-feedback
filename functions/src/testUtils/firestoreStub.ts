import * as admin from 'firebase-admin'
import { vi } from 'vitest'

// test().firestore.makeDocumentSnapshot
export const makeDocumentSnapshot = (
    data: Record<any, any> | null,
    path: string
): any => {
    return {
        ...data,
        data: () => data,
    }
}

// Used for specific event ... in tests
export const makeDocumentSnapshot2 = (
    data: Record<any, any> | null,
    path: string
): any => {
    return {
        data: data,
    }
}

export const getFirestoreMocksAndInit = () => {
    const collection = vi.fn((path) => {
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
        get: () => Promise<any>
        set: () => Promise<any>
        update: () => Promise<any>
        onSnapshot: () => Promise<any>
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

    const limit = vi.fn((limitCount: number) => {
        return {
            get,
            set,
            update,
            onSnapshot,
        }
    })

    const get = vi.fn((): Promise<any> => Promise.resolve(true))
    const set = vi.fn((): Promise<any> => Promise.resolve(true))
    const update = vi.fn((): Promise<any> => Promise.resolve(true))
    const onSnapshot = vi.fn((): Promise<any> => Promise.resolve(true))

    const firestoreStub = vi.fn(() => ({
        collection,
        snapshot_: (a, b, c, d) => {
            return {
                data: () => {
                    const newObj = {}
                    Object.keys(a.fields).forEach((key: string) => {
                        const field = a.fields[key]
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

export const replaceFirestoreByStub = (stub: any) => {
    Object.defineProperty(admin, 'firestore', {
        get: () => stub,
        configurable: true,
    })
}
