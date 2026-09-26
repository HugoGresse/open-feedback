import { describe, it, expect } from 'vitest'
import firebaseFunctionsTest from 'firebase-functions-test'
import { userCreated } from './userCreated'
import { getFirestoreMocksAndInit } from '../testUtils/firestoreStub'

const test = firebaseFunctionsTest()

describe('userCreated', () => {
    it('when a new anonymous user is created, do nothing', async () => {
        const { get, where } = getFirestoreMocksAndInit()
        get.mockImplementation(() => Promise.resolve([]))

        const userCreatedWrapped = test.wrap(userCreated)

        await expect(
            userCreatedWrapped({
                data: { uid: '123', email: undefined, providerData: [] },
            } as any)
        ).resolves.toEqual('new anonymous user')

        expect(where, 'firestore request not made').toHaveBeenCalledTimes(0)
    })

    it('when a user signs up with an email, look up their pending invites', async () => {
        const { get, where } = getFirestoreMocksAndInit()
        get.mockImplementation(() => Promise.resolve([]))

        const userCreatedWrapped = test.wrap(userCreated)

        await userCreatedWrapped({
            data: { uid: '123', email: 'jane@example.com', providerData: [] },
        } as any)

        expect(where).toHaveBeenCalledWith(
            'destinationUserInfo',
            '==',
            'jane@example.com'
        )
        expect(where).toHaveBeenCalledWith('status', '==', 'emailSent')
    })
})
