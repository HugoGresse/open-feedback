import { describe, expect, it } from 'vitest'
import { userEmailVerified } from './userEmailVerified'
import {
    getAuthMocksAndInit,
    getFirestoreMocksAndInit,
} from '../testUtils/firestoreStub'

// Runs the handler on a users/u1 change
const runOnUserDocChange = (
    before: Record<string, unknown> | null,
    after: Record<string, unknown>
) =>
    userEmailVerified.run({
        params: { userId: 'u1' },
        data: {
            before: { data: () => before ?? undefined },
            after: { data: () => after },
        },
    } as never)

describe('userEmailVerified', () => {
    it('applies pending invites once Firebase Auth says the email is verified', async () => {
        const { get, where } = getFirestoreMocksAndInit()
        const { getUser } = getAuthMocksAndInit()
        get.mockImplementation(() => Promise.resolve([]))
        getUser.mockResolvedValue({
            uid: 'u1',
            email: 'jane@example.com',
            emailVerified: true,
        })

        await runOnUserDocChange(
            { emailVerified: false },
            { emailVerified: true }
        )

        expect(getUser).toHaveBeenCalledWith('u1')
        expect(where).toHaveBeenCalledWith(
            'destinationUserInfo',
            '==',
            'jane@example.com'
        )
    })

    it('trusts Firebase Auth, not the user doc', async () => {
        const { where } = getFirestoreMocksAndInit()
        const { getUser } = getAuthMocksAndInit()
        getUser.mockResolvedValue({
            uid: 'u1',
            email: 'jane@example.com',
            emailVerified: false,
        })

        await expect(
            runOnUserDocChange(null, { emailVerified: true })
        ).resolves.toEqual('email not verified')

        expect(where).not.toHaveBeenCalled()
    })

    it.each([
        [{ emailVerified: true }, { emailVerified: true, displayName: 'J' }],
        [{ emailVerified: false }, { emailVerified: false }],
    ])(
        'does nothing when the email is not newly verified',
        async (before, after) => {
            getFirestoreMocksAndInit()
            const { getUser } = getAuthMocksAndInit()

            await expect(runOnUserDocChange(before, after)).resolves.toEqual(
                'email not newly verified'
            )

            expect(getUser).not.toHaveBeenCalled()
        }
    )
})
