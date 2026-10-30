import { describe, expect, test } from 'vitest'
import { usersReducer } from './usersReducer'
import {
    USER_INVITE_GET_ERROR,
    USER_INVITE_GET_SUCCESS,
    USER_INVITE_LISTEN,
} from './usersActionTypes'

const invite = {
    destinationUserInfo: 'ada@example.com',
    originUserId: 'origin',
    status: 'emailSent' as const,
    projectId: 'project',
    projectName: 'Project',
}

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
})
