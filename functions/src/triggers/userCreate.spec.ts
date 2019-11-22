import firebaseFunctionsTest from 'firebase-functions-test'
import {userCreate} from "./userCreate";
import {getFirestoreMocksAndInit} from "../testUtils/firestoreStub"

const test = firebaseFunctionsTest()

describe('userCreate', () => {

    it('when a new anonymous user is created, do nothing', async () => {
        const {get, firestoreStub} = getFirestoreMocksAndInit()
        get.mockImplementation(() => Promise.resolve([]))

        const userCreateWrapped = test.wrap(userCreate)

        await expect(userCreateWrapped({email: null, providerData: []})).resolves.toEqual('new anonymous user')

        expect(firestoreStub().collection('').where('', '', '').get, "firestore request not made").toHaveBeenCalledTimes(0)
    })

})
