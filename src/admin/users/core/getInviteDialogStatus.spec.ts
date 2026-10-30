import { describe, expect, test } from 'vitest'
import { getInviteDialogStatus } from './getInviteDialogStatus'
import { usersReducer } from './usersReducer'
import { USER_INVITE_GET_ERROR, USER_INVITE_GET_SUCCESS } from './usersActionTypes'

const user = { email: 'ada@example.com', phoneNumber: null }
const invite = {
    destinationUserInfo: 'ada@example.com',
    originUserId: 'origin',
    status: 'emailSent' as const,
    projectId: 'project',
    projectName: 'Project',
}

describe('getInviteDialogStatus', () => {
    test('is loading while the invite has not been read yet', () => {
        expect(getInviteDialogStatus({}, null, user)).toBe('loading')
    })

    test('is loading while the invite email is not sent', () => {
        expect(
            getInviteDialogStatus({ ...invite, status: 'new' }, null, user)
        ).toBe('loading')
    })

    test('is processing once the invite email is sent or completed', () => {
        expect(getInviteDialogStatus(invite, null, user)).toBe('processing')
        expect(
            getInviteDialogStatus({ ...invite, status: 'completed' }, null, user)
        ).toBe('processing')
    })

    test('is failed for an invite in error', () => {
        expect(
            getInviteDialogStatus({ ...invite, status: 'error' }, null, user)
        ).toBe('failed')
    })

    test('is wrongAccount when Firestore denies reading the invite', () => {
        expect(getInviteDialogStatus(null, 'notAllowed', user)).toBe(
            'wrongAccount'
        )
    })

    test('is wrongAccount when the invite was sent to another email', () => {
        expect(
            getInviteDialogStatus(
                { ...invite, destinationUserInfo: 'bob@example.com' },
                null,
                user
            )
        ).toBe('wrongAccount')
    })

    test('matches the invited email case-insensitively, or the phone', () => {
        expect(
            getInviteDialogStatus(
                { ...invite, destinationUserInfo: 'Ada@Example.com' },
                null,
                user
            )
        ).toBe('processing')
        expect(
            getInviteDialogStatus(
                { ...invite, destinationUserInfo: '+33600000000' },
                null,
                { email: null, phoneNumber: '+33600000000' }
            )
        ).toBe('processing')
    })

    test('is unavailable when the invite is missing or the read failed', () => {
        expect(getInviteDialogStatus(null, 'failed', user)).toBe('unavailable')
    })
})

describe('usersReducer invite', () => {
    test('stores the read error and clears it on a later success', () => {
        const errored = usersReducer(undefined, {
            type: USER_INVITE_GET_ERROR,
            payload: 'notAllowed',
        })
        expect(errored.invite).toBeNull()
        expect(errored.inviteReadError).toBe('notAllowed')

        const read = usersReducer(errored, {
            type: USER_INVITE_GET_SUCCESS,
            payload: invite,
        })
        expect(read.invite).toEqual(invite)
        expect(read.inviteReadError).toBeNull()
    })
})
