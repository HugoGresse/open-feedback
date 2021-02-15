import firebaseFunctionsTest from 'firebase-functions-test'
import {
    checkPendingInviteAndProcessThem,
    userInviteCreated,
} from './userInvite'

import { Response } from 'node-fetch'

jest.mock('../../email/send')
import send from '../../email/send'
import { getFirestoreMocksAndInit } from '../../testUtils/firestoreStub'
import * as admin from 'firebase-admin'

const test = firebaseFunctionsTest()

describe('userInviteCreated', () => {
    const invite = {
        id: '001',
        projectId: 'projectId1',
        projectName: 'Project Name',
        originUserName: 'Hugo G',
        destinationUserInfo: 'email@example.com',
    }

    beforeEach(() => {
        test.mockConfig({
            app: {
                url: 'http://localhost',
                domain: 'http://localhost',
                env: 'development',
            },
            mailgun: {
                key: 'MAILGUN_KEY',
                domain: 'MAILGUN_DOMAIN',
                api: 'MAILGUN_API',
            },
        })
    })

    it('should reject when a user is invited to a project while no data is received from firestore', async () => {
        const userInviteCreatedWrapped = test.wrap(userInviteCreated)

        const snapshot = {
            id: 'ee',
            data: () => {
                // Empty
            },
        }
        await expect(userInviteCreatedWrapped(snapshot)).rejects.toEqual(
            new Error('Empty data')
        )
    })

    it('should reject when a user is invited to a project, email sent but db update failed', async () => {
        const { update, collection, doc } = getFirestoreMocksAndInit()
        update.mockImplementation(() =>
            Promise.reject('firestore update failed')
        )
        ;(send as any).mockImplementation(() => new Response())

        const userInviteCreatedWrapped = test.wrap(userInviteCreated)

        const snapshot = {
            id: invite.id,
            data: () => invite,
        }
        await expect(userInviteCreatedWrapped(snapshot)).rejects.toEqual(
            'firestore update failed'
        )

        expect((send as any).mock.calls[0][0]).toEqual({
            api: 'MAILGUN_API',
            domain: 'MAILGUN_DOMAIN',
            key: 'MAILGUN_KEY',
        })
        expect((send as any).mock.calls[0][1].subject).toEqual(
            '[OpenFeedback] Hugo G invited you to become member of the event Project Name'
        )
        expect((send as any).mock.calls[0][1].to).toEqual(['email@example.com'])
        expect((send as any).mock.calls[0][1].html).toContain(
            '<!DOCTYPE html>\n<html'
        )

        expect(update).toBeCalledWith({ status: 'emailSent' })
        expect(collection).toHaveBeenCalledWith('invites')
        expect(doc).toHaveBeenCalledWith(invite.id)
    })

    it('should resolve when a user is invited to a project, thus an email is sent', async () => {
        const {
            update,
            get,
            collection,
            doc,
            where,
        } = getFirestoreMocksAndInit()

        update.mockImplementation(() => Promise.resolve('firestoreCompleted'))
        get.mockImplementationOnce(() =>
            Promise.resolve({
                forEach: () => {
                    // not implemented
                },
                empty: false,
            })
        )
        ;(send as any).mockImplementation(() => new Response())

        const userInviteCreatedWrapped = test.wrap(userInviteCreated)

        const snapshot = {
            id: invite.id,
            data: () => invite,
        }
        await expect(userInviteCreatedWrapped(snapshot)).resolves.toEqual(
            'forEach not implemented or firebase issue'
        )

        expect(update).toBeCalledWith({ status: 'emailSent' })
        expect(collection).toHaveBeenCalledWith('invites')
        expect(doc).toHaveBeenCalledWith(invite.id)

        expect(collection).toHaveBeenCalledWith('users')
        expect(where).toHaveBeenCalledWith(
            'email',
            '==',
            invite.destinationUserInfo
        )
    })
})

describe('checkPendingInviteAndProcessThem', () => {
    const user: admin.auth.UserRecord = {
        uid: '00001',
        emailVerified: true,
        disabled: false,
        metadata: {} as any,
        providerData: [],
        email: 'toto@example.com',
        toJSON: () => ({}),
    }

    it('check pending invites, no nothing is none was found', async () => {
        const { get, collection, where } = getFirestoreMocksAndInit()

        get.mockImplementation(() => Promise.resolve([]))

        await expect(checkPendingInviteAndProcessThem(user)).resolves.toEqual(
            []
        )

        expect(collection).toHaveBeenCalledWith('invites')
        expect(where).toHaveBeenCalledWith(
            'destinationUserInfo',
            '==',
            user.email
        )
        expect(where).toHaveBeenCalledWith('status', '==', 'emailSent')
        expect(get).toHaveBeenCalledTimes(1)
    })

    it('check pending invites and assert process', async () => {
        const { get, update } = getFirestoreMocksAndInit()

        const snapshot = {
            data: () => ({ projectId: '12' }),
        }
        const snapshot2 = {
            data: () => ({ projectId: '33' }),
        }
        get.mockImplementation(() => Promise.resolve([snapshot, snapshot2]))
        update.mockImplementationOnce(() => Promise.resolve('1'))
        update.mockImplementationOnce(() => Promise.resolve('2'))
        update.mockImplementationOnce(() => Promise.resolve('a1'))
        update.mockImplementationOnce(() => Promise.resolve('a2'))

        await expect(checkPendingInviteAndProcessThem(user)).resolves.toEqual([
            'a1',
            'a2',
        ])

        expect(get, 'invites has been queried').toHaveBeenCalledTimes(1)
        expect(
            update,
            'projects and invites has been updated once each for each invite'
        ).toHaveBeenCalledTimes(4)
    })
})
