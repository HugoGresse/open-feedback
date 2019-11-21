import * as admin from "firebase-admin"

export const firestoreStub = jest.fn(() => ({
    collection
}))

export const collection = jest.fn((path) => {
    return {
        where,
        doc
    }
})

export const doc = jest.fn((docId) => {
    return {
        get,
        set,
        update,
        onSnapshot
    }
})

export const where: (firstTerm: string, operator: string, secondTerm: string) => {
    get: () => {},
    set: () => {},
    update: () => {},
    onSnapshot: () => {},
} = jest.fn((firstTerm: string, operator: string, secondTerm: string) => {
    return {
        where,
        get,
        set,
        update,
        onSnapshot
    }
})

export const get = jest.fn(():Promise<any> => Promise.resolve(true))
export const set = jest.fn(():Promise<any> => Promise.resolve(true))
export const update = jest.fn(():Promise<any> => Promise.resolve(true))
export const onSnapshot = jest.fn(():Promise<any> => Promise.resolve(true))

export const replaceFirestoreByStub = () => {
    Object.defineProperty(
        admin,
        'firestore',
        { get: () => firestoreStub, configurable: true })
}
