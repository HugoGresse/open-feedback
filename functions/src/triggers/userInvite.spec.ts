import firebaseFunctionsTest from 'firebase-functions-test'
import {
    checkPendingInviteAndProcessThem,
    userInviteCreated
} from './userInvite'

import {Response} from "node-fetch"

jest.mock('../email/send')
import send from '../email/send'
import {getFirestoreMocksAndInit} from "../testUtils/firestoreStub"
import * as admin from 'firebase-admin'

const test = firebaseFunctionsTest()

describe('userInviteCreated', () => {
    const invite = {
        id: "001",
        projectId: "ozeBdajelkVB6yF9tqB3",
        projectName: "Project Name",
        originUserName: "Hugo G",
        destinationUserInfo: "xonim81605@tmailpro.net"
    }

    beforeEach(() => {
        test.mockConfig({
            app: {
                url: 'http://localhost'
            },
            mailgun: {
                key: "MAILGUN_KEY",
                domain: "MAILGUN_DOMAIN",
                api: "MAILGUN_API"
            }
        })
    })

    it('should reject when a user is invited to a project while no data is received from firestore', async () => {
        const userInviteCreatedWrapped = test.wrap(userInviteCreated)

        const snapshot = {
            id: "ee",
            data: () => {
                // Empty
            }
        }
        await expect(userInviteCreatedWrapped(snapshot)).rejects.toEqual(new Error('Empty data'))
    })

    it('should resolve when a user is invited to a project, thus an email is sent', async () => {
        const {update, get, firestoreStub} = getFirestoreMocksAndInit()

        update.mockImplementation(() => Promise.resolve("firestoreCompleted"))
        get.mockImplementationOnce(() => Promise.resolve({
            forEach: () => {},
            empty: false
        }))

        ;(send as any).mockImplementation(() => new Response())

        const userInviteCreatedWrapped = test.wrap(userInviteCreated)

        const snapshot = {
            id: invite.id,
            data: () => invite
        }
        await expect(userInviteCreatedWrapped(snapshot)).resolves.toEqual(['firestoreCompleted', 'forEach not implemented or firebase issue'])

        expect(firestoreStub().collection('projects-invites').doc(invite.id).update).toBeCalledWith({status: 'emailSent'})
    })
})

describe('checkPendingInviteAndProcessThem', () => {

    const user: admin.auth.UserRecord = {
        uid: '00001',
        emailVerified: true,
        disabled: false,
        metadata: {} as any,
        providerData: [],
        email: "toto@example.com",
        toJSON: () => true
    }

    it('check pending invites, no nothing is none was found', async () => {
        const {get, firestoreStub} = getFirestoreMocksAndInit()

        get.mockImplementation(() => Promise.resolve([]))

        await expect(checkPendingInviteAndProcessThem(user)).resolves.toEqual([])

        expect(firestoreStub().collection('').where('', '', '').get, 'projects-invites has been queried').toHaveBeenCalledTimes(1)
    })

    it('check pending invites and assert process', async () => {
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

        await expect(checkPendingInviteAndProcessThem(user)).resolves.toEqual(["a1", "a2"])

        expect(firestoreStub().collection('').where('', '', '').get, 'projects-invites has been queried').toHaveBeenCalledTimes(1)
        expect(firestoreStub().collection('').doc('').update, 'projects and projects-invites has been updated once each for each invite').toHaveBeenCalledTimes(4)
    })
})
