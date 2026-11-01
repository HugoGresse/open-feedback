import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import firebaseFunctionsTest from 'firebase-functions-test'
import {
    checkPendingInviteAndProcessThem,
    userInviteCreated,
} from './userInvite'
import {
    getAuthMocksAndInit,
    getFirestoreMocksAndInit,
    makeDocumentSnapshot,
    makeDocumentSnapshot2,
} from '../../testUtils/firestoreStub'
import type * as admin from 'firebase-admin'
import { vi } from 'vitest'
import { arrayUnion, serverTimestamp } from '../../helpers/firebaseInit'

vi.mock('../../email/send')
import send from '../../email/send'

const test = firebaseFunctionsTest()

describe('userInviteCreated', () => {
    const invite = {
        id: '001',
        projectId: 'projectId1',
        projectName: 'Project Name',
        originUserName: 'Hugo G',
        destinationUserInfo: 'email@example.com',
    }
    const OLD_ENV = process.env
    beforeEach(() => {
        process.env.APP_ENV = 'test'
        process.env.APP_URL = 'http://localhost:3000'
        process.env.MAILGUN_API = 'MAILGUN_API'
        process.env.MAILGUN_DOMAIN = 'MAILGUN_DOMAIN'
        process.env.MAILGUN_KEY = 'MAILGUN_KEY'

        test.mockConfig({
            app: {
                url: 'http://localhost',
                domain: 'http://localhost',
                env: 'development',
            },
        })
    })
    afterEach(() => {
        vi.clearAllMocks()
        vi.resetModules()
        test.cleanup()
        process.env = { ...OLD_ENV }
        delete process.env.NODE_ENV
    })

    it('should reject when a user is invited to a project while no data is received from firestore', async () => {
        const userInviteCreatedWrapped = test.wrap(userInviteCreated)

        const snapshot = makeDocumentSnapshot(null, `invites/${invite.id}`)
        await expect(userInviteCreatedWrapped(snapshot)).rejects.toEqual(
            new Error('Empty data')
        )
    })

    it('should reject when a user is invited to a project, email sent but db update failed', async () => {
        const { update, collection, doc } = getFirestoreMocksAndInit()
        update.mockImplementation(() =>
            Promise.reject('firestore update failed')
        )
        vi.mocked(send).mockResolvedValue(new Response())

        const userInviteCreatedWrapped = test.wrap(userInviteCreated)

        const snapshot = makeDocumentSnapshot2(invite, `invites/${invite.id}`)
        await expect(userInviteCreatedWrapped(snapshot)).rejects.toEqual(
            'firestore update failed'
        )

        expect(vi.mocked(send).mock.calls[0][0]).toEqual({
            api: 'MAILGUN_API',
            domain: 'MAILGUN_DOMAIN',
            key: 'MAILGUN_KEY',
        })
        expect(vi.mocked(send).mock.calls[0][1].subject).toEqual(
            '[OpenFeedback] Hugo G invited you to become member of the event Project Name'
        )
        expect(vi.mocked(send).mock.calls[0][1].to).toEqual([
            'email@example.com',
        ])
        expect(vi.mocked(send).mock.calls[0][1].html).toContain(
            '<!DOCTYPE html>\n<html'
        )

        expect(update).toBeCalledWith({ status: 'emailSent' })
        expect(collection).toHaveBeenCalledWith('invites')
        expect(doc).toHaveBeenCalledWith(invite.id)
    })

    it('should resolve when the invited email has no account yet', async () => {
        const { update, collection } = getFirestoreMocksAndInit()
        const { getUserByEmail } = getAuthMocksAndInit()
        getUserByEmail.mockRejectedValue({ code: 'auth/user-not-found' })
        vi.mocked(send).mockResolvedValue(new Response())

        const snapshot = makeDocumentSnapshot2(invite, `invites/${invite.id}`)
        await expect(test.wrap(userInviteCreated)(snapshot)).resolves.toEqual(
            'no user matched'
        )

        expect(update).toBeCalledWith({ status: 'emailSent' })
        expect(getUserByEmail).toHaveBeenCalledWith(invite.destinationUserInfo)
        // Never the users collection: its email field is written by users
        expect(collection).not.toHaveBeenCalledWith('users')
    })

    it('should apply the invite to the verified Firebase Auth user of that email', async () => {
        const { get, update } = getFirestoreMocksAndInit()
        const { getUserByEmail } = getAuthMocksAndInit()
        getUserByEmail.mockResolvedValue({
            uid: 'authUid',
            email: invite.destinationUserInfo,
            emailVerified: true,
        })
        get.mockImplementation(() =>
            Promise.resolve([
                { id: invite.id, data: () => ({ projectId: 'projectId1' }) },
            ])
        )
        vi.mocked(send).mockResolvedValue(new Response())

        const snapshot = makeDocumentSnapshot2(invite, `invites/${invite.id}`)
        await test.wrap(userInviteCreated)(snapshot)

        expect(update).toHaveBeenCalledWith({
            members: arrayUnion('authUid'),
            updatedAt: serverTimestamp(),
        })
    })

    it('should not apply the invite to an account whose email is not verified', async () => {
        const { where, update } = getFirestoreMocksAndInit()
        const { getUserByEmail } = getAuthMocksAndInit()
        getUserByEmail.mockResolvedValue({
            uid: 'squatterUid',
            email: invite.destinationUserInfo,
            emailVerified: false,
        })
        vi.mocked(send).mockResolvedValue(new Response())

        const snapshot = makeDocumentSnapshot2(invite, `invites/${invite.id}`)
        await expect(test.wrap(userInviteCreated)(snapshot)).resolves.toEqual(
            'email not verified'
        )

        expect(where).not.toHaveBeenCalled()
        expect(update).toHaveBeenCalledTimes(1)
        expect(update).toHaveBeenCalledWith({ status: 'emailSent' })
    })

    it('should not send an invite that targets both a project and an organization', async () => {
        const { update } = getFirestoreMocksAndInit()
        const { getUserByEmail } = getAuthMocksAndInit()
        vi.spyOn(console, 'error').mockImplementation(() => undefined)

        const snapshot = makeDocumentSnapshot2(
            { ...invite, organizationId: 'org1', role: 'Admin' },
            `invites/${invite.id}`
        )
        await test.wrap(userInviteCreated)(snapshot)

        expect(send).not.toHaveBeenCalled()
        expect(getUserByEmail).not.toHaveBeenCalled()
        expect(update).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'error',
                error: 'Invalid invite target',
            })
        )
    })
})

describe('checkPendingInviteAndProcessThem', () => {
    const user: admin.auth.UserRecord = {
        uid: '00001',
        emailVerified: true,
        disabled: false,
        metadata: {} as admin.auth.UserMetadata,
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

    it('marks a pending invite with both targets as errored instead of applying it', async () => {
        const { get, update, doc } = getFirestoreMocksAndInit()
        get.mockImplementation(() =>
            Promise.resolve([
                {
                    id: 'bad',
                    data: () => ({
                        projectId: '12',
                        organizationId: 'victimOrg',
                        role: 'Admin',
                    }),
                },
            ])
        )

        await checkPendingInviteAndProcessThem(user)

        expect(doc).not.toHaveBeenCalledWith('victimOrg')
        expect(doc).toHaveBeenCalledWith('bad')
        expect(update).toHaveBeenCalledTimes(1)
        expect(update).toHaveBeenCalledWith(
            expect.objectContaining({ status: 'error' })
        )
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
