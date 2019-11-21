import firebaseFunctionsTest from 'firebase-functions-test'
import {userCreate} from "./userCreate";
import {getFirestoreMocksAndInit} from "../testUtils/firestoreStub"

const test = firebaseFunctionsTest()

describe('userCreate', () => {
    const user = {
        email: "toto@example.com"
    }

    it('when a new anonymous user is created, do nothing', async () => {
        const {get, firestoreStub} = getFirestoreMocksAndInit()
        get.mockImplementation(() => Promise.resolve([]))

        const userCreateWrapped = test.wrap(userCreate)

        await expect(userCreateWrapped({email: null, providerData: []})).resolves.toEqual('new anonymous user')

        expect(firestoreStub().collection('').where('', '', '').get, "firestore request not made").toHaveBeenCalledTimes(0)
    })

    it('when a new real user is created, check pending invites', async () => {
        const {get, firestoreStub} = getFirestoreMocksAndInit()

        get.mockImplementation(() => Promise.resolve([]))

        const userCreateWrapped = test.wrap(userCreate)

        await expect(userCreateWrapped(user)).resolves.toEqual([])

        expect(firestoreStub().collection('').where('', '', '').get, 'projects-invites has been queried').toHaveBeenCalledTimes(1)
    })

    it('when a new real user is created, with pending invites, process it', async () => {
        const {get, update, firestoreStub} = getFirestoreMocksAndInit()

        const snapshot = {
            data: () => ({projectId: "12"})
        }
        const snapshot2 = {
            data: () => ({projectId: "33"})
        }
        get.mockImplementation(() => Promise.resolve([snapshot, snapshot2]))
        update.mockImplementationOnce(() => Promise.resolve("1"))
        update.mockImplementationOnce(() => Promise.resolve("2"))
        update.mockImplementationOnce(() => Promise.resolve("a1"))
        update.mockImplementationOnce(() => Promise.resolve("a2"))

        const userCreateWrapped = test.wrap(userCreate)

        await expect(userCreateWrapped(user)).resolves.toEqual(["a1", "a2"])

        expect(firestoreStub().collection('').where('', '', '').get, 'projects-invites has been queried').toHaveBeenCalledTimes(1)
        expect(firestoreStub().collection('').doc('').update, 'projects and projects-invites has been updated once each for each invite').toHaveBeenCalledTimes(4)
    })
})
