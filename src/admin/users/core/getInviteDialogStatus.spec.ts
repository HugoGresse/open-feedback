import { describe, expect, test } from 'vitest'
import {
    getInviteDestination,
    getInviteDestinationUrl,
    getInviteDialogStatus,
} from './getInviteDialogStatus'
import type { UsersState } from './usersReducer'

const invite = {
    destinationUserInfo: 'ada@example.com',
    originUserId: 'origin',
    projectId: 'project',
    projectName: 'Project',
}

const organizationInvite = {
    destinationUserInfo: 'ada@example.com',
    originUserId: 'origin',
    organizationId: 'organization',
    organizationName: 'Organization',
    role: 'Viewer',
}

describe('getInviteDialogStatus', () => {
    test.each<[string, UsersState['invite'], string]>([
        ['not read yet', {}, 'loading'],
        ['email not sent yet', { ...invite, status: 'new' }, 'loading'],
        ['email sent', { ...invite, status: 'emailSent' }, 'processing'],
        ['completed', { ...invite, status: 'completed' }, 'accepted'],
        ['in error', { ...invite, status: 'error' }, 'failed'],
        ['denied by the rules', 'notAllowed', 'wrongAccount'],
        ['missing or read failed', 'failed', 'unavailable'],
    ])('invite %s: %s', (_, value, status) => {
        expect(getInviteDialogStatus(value)).toBe(status)
    })
})

describe('getInviteDestination', () => {
    test.each<[string, UsersState['invite'], unknown]>([
        [
            'an event',
            invite,
            { type: 'project', id: 'project', name: 'Project' },
        ],
        [
            'an organization',
            organizationInvite,
            { type: 'organization', id: 'organization', name: 'Organization' },
        ],
        ['not read yet', {}, null],
        ['unreadable', 'notAllowed', null],
    ])('invite to %s', (_, value, destination) => {
        expect(getInviteDestination(value)).toEqual(destination)
    })
})

describe('getInviteDestinationUrl', () => {
    test('is absolute, whatever the current url', () => {
        expect(getInviteDestinationUrl({ type: 'project', id: 'p' })).toBe(
            '/admin/event/p/'
        )
        expect(getInviteDestinationUrl({ type: 'organization', id: 'o' })).toBe(
            '/admin/org/o/'
        )
    })
})
