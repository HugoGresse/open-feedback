import { beforeEach, describe, expect, test, vi } from 'vitest'
import { didSignIn, type SignInUser } from './authActions'
import type { SerializedFirebaseUser } from './authActionTypes'
import type { AppDispatch, RootState } from '../../store'

const firestore = vi.hoisted(() => ({
    userInDb: undefined as Record<string, unknown> | undefined,
    update: vi.fn(),
}))

vi.mock('../../firebase.ts', () => ({
    authProvider: {},
    fireStoreMainInstance: {},
}))
vi.mock('firebase/auth', () => ({ signOut: vi.fn() }))
vi.mock('firebase/firestore', () => ({
    doc: vi.fn((_db, ...path: string[]) => path.join('/')),
    getDoc: () =>
        Promise.resolve({
            exists: () => !!firestore.userInDb,
            data: () => firestore.userInDb,
        }),
    setDoc: vi.fn(),
    updateDoc: firestore.update,
    serverTimestamp: () => 'serverTimestamp',
}))
vi.mock('../../utils/analytics/track', () => ({
    trackLogin: vi.fn(),
    trackSignIn: vi.fn(),
    trackUserId: vi.fn(),
}))

const storedUser = {
    uid: 'u1',
    displayName: 'Ada',
    photoURL: 'https://example.com/ada.png',
    email: 'ada@example.com',
}

const signIn = (user: Partial<SerializedFirebaseUser>) => {
    const baseUser: SignInUser = {
        toJSON: () => ({
            ...storedUser,
            isAnonymous: false,
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
    firestore.update.mockReset()
})

describe('didSignIn emailVerified', () => {
    test('does not rewrite an unchanged unverified user', async () => {
        firestore.userInDb = { ...storedUser, emailVerified: false }

        await signIn({ emailVerified: false })

        expect(firestore.update).not.toHaveBeenCalled()
    })

    test('does not rewrite an unchanged verified user', async () => {
        firestore.userInDb = { ...storedUser, emailVerified: true }

        await signIn({ emailVerified: true })

        expect(firestore.update).not.toHaveBeenCalled()
    })

    test('stores a newly verified email', async () => {
        firestore.userInDb = { ...storedUser, emailVerified: false }

        await signIn({ emailVerified: true })

        expect(firestore.update).toHaveBeenCalledOnce()
        expect(firestore.update.mock.calls[0][0]).toBe('users/u1')
        expect(firestore.update.mock.calls[0][1].emailVerified).toBe(true)
    })
})
