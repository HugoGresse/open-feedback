import firebaseFunctionsTest from 'firebase-functions-test'
import { userCreate } from './userCreate'
import {
    getFirestoreMocksAndInit,
    makeDocumentSnapshot,
} from '../testUtils/firestoreStub'

const test = firebaseFunctionsTest()

describe('userCreate', () => {
    it('when a new anonymous user is created, do nothing', async () => {
        const { get, firestoreStub } = getFirestoreMocksAndInit()
        get.mockImplementation(() => Promise.resolve([]))

        const userCreateWrapped = test.wrap(userCreate)

        const snapshot = makeDocumentSnapshot(
            { email: null, providerData: [] },
            'users/123'
        )

        await expect(userCreateWrapped(snapshot)).resolves.toEqual(
            'new anonymous user'
        )

        expect(
            firestoreStub().collection('').where('', '', '').get,
            'firestore request not made'
        ).toHaveBeenCalledTimes(0)
    })
})
