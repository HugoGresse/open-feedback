import { describe, expect, test, vi } from 'vitest'
import { isVoteAllowed } from './isVoteAllowed'
import { ADD_VOTE_ERROR } from '../voteActionTypes'
import type { TFunction } from 'i18next'
import type { AppDispatch, RootState } from '../../../store'

// The vote window is open
vi.mock('../checkDataBeforeVote', () => ({
    checkDateBeforeVote: () => false,
}))

const translate = ((key: string) => key) as TFunction

const setup = (user: { isAnonymous: boolean } | null) => {
    const dispatch = vi.fn() as unknown as AppDispatch
    // Only the auth slice is read
    const getState = () => ({ auth: { user } }) as unknown as RootState
    return { dispatch, getState }
}

describe('isVoteAllowed', () => {
    test('refuses the vote and reports it before the user is logged in', () => {
        const { dispatch, getState } = setup(null)

        expect(isVoteAllowed(dispatch, getState, translate)).toBe(false)
        expect(dispatch).toHaveBeenCalledWith({
            type: ADD_VOTE_ERROR,
            payload: { error: 'vote.notLoggedIn' },
        })
    })

    test('allows the vote of an anonymous user', () => {
        const { dispatch, getState } = setup({ isAnonymous: true })

        expect(isVoteAllowed(dispatch, getState, translate)).toBe(true)
        expect(dispatch).not.toHaveBeenCalled()
    })

    test('allows the vote of an admin, with a warning', () => {
        const { dispatch, getState } = setup({ isAnonymous: false })

        expect(isVoteAllowed(dispatch, getState, translate)).toBe(true)
        expect(dispatch).toHaveBeenCalledWith({
            type: ADD_VOTE_ERROR,
            payload: { error: 'vote.adminNotAnonymous' },
        })
    })
})
