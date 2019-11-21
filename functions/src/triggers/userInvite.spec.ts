import admin from 'firebase-admin'
import firebaseFunctionsTest from 'firebase-functions-test'
import {userInviteCreated} from './userInvite'

import {Response} from "node-fetch"

jest.mock('../email/send')
import send from '../email/send'

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
        const mockSet = jest.fn()
        mockSet.mockReturnValue("firestoreCompleted")

        const firestoreStub = jest.fn(() => ({
            collection: jest.fn(path => ({
                doc: jest.fn(secondPath => ({
                    update: mockSet
                }))
            }))
        }))

        Object.defineProperty(admin, 'firestore', { get: () => firestoreStub, configurable: true })

        ;(send as any).mockImplementation(() => new Response())

        const userInviteCreatedWrapped = test.wrap(userInviteCreated)

        const snapshot = {
            id: invite.id,
            data: () => invite
        }
        await expect(userInviteCreatedWrapped(snapshot)).resolves.toEqual('firestoreCompleted')

        expect(firestoreStub().collection('projects-invites').doc(invite.id).update).toBeCalledWith({status: 'emailSent'})
    })
})
