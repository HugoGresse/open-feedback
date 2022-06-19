import * as admin from 'firebase-admin'

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

export const getFirestoreMocksAndInit = () => {
    const firestoreStub = jest.fn(() => ({
        collection,
    }))

    const collection = jest.fn((path) => {
        return {
            where,
            limit,
            doc,
        }
    })

    const doc = jest.fn(() => {
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
    } = jest.fn(() => {
        return {
            where,
            limit,
            get,
            set,
            update,
            onSnapshot,
        }
    })

    const limit = jest.fn((limitCount: number) => {
        return {
            get,
            set,
            update,
            onSnapshot,
        }
    })

    const get = jest.fn((): Promise<any> => Promise.resolve(true))
    const set = jest.fn((): Promise<any> => Promise.resolve(true))
    const update = jest.fn((): Promise<any> => Promise.resolve(true))
    const onSnapshot = jest.fn((): Promise<any> => Promise.resolve(true))

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
