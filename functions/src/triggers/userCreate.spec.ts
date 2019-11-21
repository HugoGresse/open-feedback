import firebaseFunctionsTest from 'firebase-functions-test'
import {userCreate} from "./userCreate";
import {firestoreStub, get, replaceFirestoreByStub, update} from "../helpers/firestoreStub.spec"

const test = firebaseFunctionsTest()

describe('userCreate', () => {
    const user = {
        email: "toto@example.com"
    }
    // const invite = {
    //     id: "001",
    //     projectId: "ozeBdajelkVB6yF9tqB3",
    //     projectName: "Project Name",
    //     originUserName: "Hugo G",
    //     destinationUserInfo: "xonim81605@tmailpro.net"
    // }

    beforeEach(() => {
        test.mockConfig({
        })
    })

    it('when a new anonymous user is created, no nothing', async () => {
        get.mockImplementation(() => Promise.resolve([]))
        replaceFirestoreByStub()

        const userCreateWrapped = test.wrap(userCreate)

        await expect(userCreateWrapped({email: null, providerData: []})).resolves.toEqual('new anonymous user')

        expect(firestoreStub().collection('').where('', '', '').get, "firestore request not made").toHaveBeenCalledTimes(0)
    })

    it('when a new real user is created, with no pending invites, no nothing more', async () => {
        get.mockImplementation(() => Promise.resolve([]))
        replaceFirestoreByStub()

        const userCreateWrapped = test.wrap(userCreate)

        await expect(userCreateWrapped(user)).resolves.toEqual([])

        expect(firestoreStub().collection('').where('', '', '').get, 'projects-invites has been queried').toHaveBeenCalledTimes(1)
    })

    it('when a new real user is created, with pending invites, process it', async () => {
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
        replaceFirestoreByStub()

        const userCreateWrapped = test.wrap(userCreate)

        await expect(userCreateWrapped(user)).resolves.toEqual(["a1", "a2"])

        expect(firestoreStub().collection('').where('', '', '').get, 'projects-invites has been queried').toHaveBeenCalledTimes(1)
    })
})
