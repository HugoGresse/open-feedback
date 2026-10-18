import { beforeEach, describe, expect, test, vi } from 'vitest'
import { didSignIn, type SignInUser } from './authActions'
import type { SerializedFirebaseUser } from './authActionTypes'
import type { AppDispatch, RootState } from '../../store'

const firestore = vi.hoisted(() => ({
    userInDb: undefined as Record<string, unknown> | undefined,
    set: vi.fn(),
    update: vi.fn(),
}))

vi.mock('../../firebase.ts', () => ({
    authProvider: {},
    serverTimestamp: () => 'serverTimestamp',
    fireStoreMainInstance: {
        collection: () => ({
            doc: () => ({
                get: () =>
                    Promise.resolve({
                        exists: !!firestore.userInDb,
                        data: () => firestore.userInDb,
                    }),
                set: firestore.set,
                update: firestore.update,
            }),
        }),
    },
}))
vi.mock('../../utils/analytics/track', () => ({
    trackLogin: vi.fn(),
    trackSignIn: vi.fn(),
    trackUserId: vi.fn(),
}))

const signIn = (user: Partial<SerializedFirebaseUser>) => {
    const baseUser: SignInUser = {
        toJSON: () => ({
            uid: 'u1',
            isAnonymous: false,
            emailVerified: false,
            providerData: [],
            ...user,
        }),
    }
    const dispatch = vi.fn() as unknown as AppDispatch
    const getState = () =>
        ({
            admin: { adminAuth: { isLogin: false, user: null } },
        }) as unknown as RootState
    return didSignIn(baseUser)(dispatch, getState, undefined)
}

beforeEach(() => {
    firestore.userInDb = undefined
    firestore.set.mockReset()
    firestore.update.mockReset()
})

describe('didSignIn', () => {
    test('creates the user of a phone login with a null email', async () => {
        // toJSON() omits the email of a phone-auth user
        await signIn({ phoneNumber: '+33600000000' })

        expect(firestore.set).toHaveBeenCalledOnce()
        const userField = firestore.set.mock.calls[0][0]
        expect(userField.email).toBeNull()
        expect(userField.phoneNumber).toBe('+33600000000')
    })

    test('updates the stored email with the login email', async () => {
        firestore.userInDb = { uid: 'u1', email: 'old@example.com' }

        await signIn({ email: 'new@example.com' })

        expect(firestore.update).toHaveBeenCalledOnce()
        expect(firestore.update.mock.calls[0][0].email).toBe('new@example.com')
    })
})
