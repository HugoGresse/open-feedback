import { describe, expect, test } from 'vitest'
import { getInviteDialogStatus } from './getInviteDialogStatus'
import type { UsersState } from './usersReducer'

const invite = {
    destinationUserInfo: 'ada@example.com',
    originUserId: 'origin',
    projectId: 'project',
    projectName: 'Project',
}

describe('getInviteDialogStatus', () => {
    test.each<[string, UsersState['invite'], string]>([
        ['not read yet', {}, 'loading'],
        ['email not sent yet', { ...invite, status: 'new' }, 'loading'],
        ['email sent', { ...invite, status: 'emailSent' }, 'processing'],
        ['completed', { ...invite, status: 'completed' }, 'processing'],
        ['in error', { ...invite, status: 'error' }, 'failed'],
        ['denied by the rules', 'notAllowed', 'wrongAccount'],
        ['missing or read failed', 'failed', 'unavailable'],
    ])('invite %s: %s', (_, value, status) => {
        expect(getInviteDialogStatus(value)).toBe(status)
    })
})
