import { describe, expect, test } from 'vitest'
import { hasJustAccepted, usersReducer } from './usersReducer'
import {
    USER_INVITE_ADD,
    USER_INVITE_GET_ERROR,
    USER_INVITE_GET_SUCCESS,
    USER_INVITE_HIDE,
    USER_INVITE_LISTEN,
    USER_INVITE_REMOVE_SUCCESS,
    USER_INVITES_GET_SUCCESS,
    USER_INVITES_LISTEN,
    type UsersAction,
} from './usersActionTypes'
import { SELECT_PROJECT } from '../../project/core/projectActionTypes'
import type { Invite, InviteStatus } from '../../../core/models'

const invite = {
    destinationUserInfo: 'ada@example.com',
    originUserId: 'origin',
    status: 'emailSent' as const,
    projectId: 'project',
    projectName: 'Project',
}

const listed = (id: string, status: InviteStatus): Invite => ({
    ...invite,
    id,
    status,
})

describe('usersReducer invite', () => {
    test('stores the read result, reset to loading on a new listen', () => {
        const errored = usersReducer(undefined, {
            type: USER_INVITE_GET_ERROR,
            payload: 'notAllowed',
        })
        expect(errored.invite).toBe('notAllowed')

        const listening = usersReducer(errored, { type: USER_INVITE_LISTEN })
        expect(listening.invite).toEqual({})

        const read = usersReducer(listening, {
            type: USER_INVITE_GET_SUCCESS,
            payload: invite,
        })
        expect(read.invite).toEqual(invite)
    })

    test('keeps the read invite when the joined project is selected', () => {
        const read = usersReducer(undefined, {
            type: USER_INVITE_GET_SUCCESS,
            payload: { ...invite, status: 'completed' },
        })
        const selected = usersReducer(read, {
            type: SELECT_PROJECT,
            payload: 'project',
        })
        expect(selected.invite).toEqual(read.invite)
    })
})

describe('usersReducer invites list', () => {
    const getInvites = (invites: Invite[]): UsersAction => ({
        type: USER_INVITES_GET_SUCCESS,
        payload: invites,
    })

    test('does not list an invite without a known status', () => {
        const state = usersReducer(
            undefined,
            getInvites([
                { ...listed('a', 'new'), status: undefined },
            ] as unknown as Invite[])
        )
        expect(state.invites).toEqual([])
    })

    test('lists the pending invites, not the ones accepted before', () => {
        const state = usersReducer(
            undefined,
            getInvites([
                listed('a', 'new'),
                listed('b', 'completed'),
                listed('c', 'emailSent'),
                listed('d', 'error'),
            ])
        )
        expect(state.invites.map(({ id }) => id)).toEqual(['a', 'c', 'd'])
    })

    test('keeps an invite accepted while listed, until hidden', () => {
        const pending = usersReducer(
            undefined,
            getInvites([listed('a', 'emailSent'), listed('b', 'emailSent')])
        )
        const accepted = usersReducer(
            pending,
            getInvites([listed('a', 'completed'), listed('b', 'emailSent')])
        )
        expect(accepted.invites).toEqual([
            listed('a', 'completed'),
            listed('b', 'emailSent'),
        ])

        const hidden = usersReducer(accepted, {
            type: USER_INVITE_HIDE,
            payload: 'a',
        })
        expect(hidden.invites).toEqual([listed('b', 'emailSent')])

        // Still in the next snapshots, but not listed anymore
        const next = usersReducer(
            hidden,
            getInvites([listed('a', 'completed'), listed('b', 'completed')])
        )
        expect(next.invites).toEqual([listed('b', 'completed')])
    })

    test('a new listen does not show the invites accepted meanwhile', () => {
        const pending = usersReducer(
            undefined,
            getInvites([listed('a', 'emailSent')])
        )
        const listening = usersReducer(pending, { type: USER_INVITES_LISTEN })
        expect(listening.invites).toEqual([])
        expect(
            usersReducer(listening, getInvites([listed('a', 'completed')]))
                .invites
        ).toEqual([])
    })

    test('drops the cancelled invites', () => {
        const pending = usersReducer(
            undefined,
            getInvites([listed('a', 'new'), listed('b', 'new')])
        )
        expect(
            usersReducer(pending, getInvites([listed('b', 'new')])).invites
        ).toEqual([listed('b', 'new')])
        expect(
            usersReducer(pending, {
                type: USER_INVITE_REMOVE_SUCCESS,
                payload: 'a',
            }).invites
        ).toEqual([listed('b', 'new')])
    })

    test('adds a created invite once, already delivered by the listener or not', () => {
        const pending = usersReducer(
            undefined,
            getInvites([listed('a', 'new')])
        )
        const added = usersReducer(pending, {
            type: USER_INVITE_ADD,
            payload: listed('b', 'new'),
        })
        expect(added.invites.map(({ id }) => id)).toEqual(['a', 'b'])
        expect(
            usersReducer(added, {
                type: USER_INVITE_ADD,
                payload: listed('b', 'new'),
            })
        ).toBe(added)
    })
})

describe('hasJustAccepted', () => {
    test('only on the snapshot where a listed pending invite completes', () => {
        const pending = [listed('a', 'emailSent'), listed('b', 'new')]
        const accepted = [listed('a', 'completed'), listed('b', 'new')]
        expect(hasJustAccepted(pending, accepted)).toBe(true)
        expect(hasJustAccepted(accepted, accepted)).toBe(false)
        expect(hasJustAccepted([], accepted)).toBe(false)
        expect(hasJustAccepted(pending, pending)).toBe(false)
        expect(
            hasJustAccepted(pending, [
                { ...listed('a', 'new'), status: 'x' },
            ] as unknown as Invite[])
        ).toBe(false)
    })
})
