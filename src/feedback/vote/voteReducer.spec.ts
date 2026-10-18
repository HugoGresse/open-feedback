import { describe, expect, test, vi } from 'vitest'
import { voteReducer, type VoteState } from './voteReducer'
import { ADD_VOTE_ERROR, REMOVE_VOTE_BEFORE_SUCCESS } from './voteActionTypes'
import { VOTE_STATUS_ACTIVE } from '../../core/contants'
import type { FirestoreDate, Vote } from '../../core/models'

// Dates are irrelevant to the reducer
const date = {} as FirestoreDate

const vote: Vote = {
    id: 'v1',
    projectId: 'p1',
    talkId: 't1',
    voteItemId: 'vi1',
    userId: 'u1',
    status: VOTE_STATUS_ACTIVE,
    createdAt: date,
    updatedAt: date,
}

const initialState: VoteState = {
    currentUserVotes: { [vote.id]: vote },
    errorVotePost: null,
    errorVotesLoad: null,
}

describe('voteReducer ADD_VOTE_ERROR', () => {
    test('drops the optimistic vote that failed to be added', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined)
        const state = voteReducer(initialState, {
            type: ADD_VOTE_ERROR,
            payload: { error: 'failed', voteId: vote.id },
        })

        expect(state.currentUserVotes).toEqual({})
        expect(state.errorVotePost).toBe('failed')
    })

    test('restores the vote that failed to be removed', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined)
        const removingState = voteReducer(initialState, {
            type: REMOVE_VOTE_BEFORE_SUCCESS,
            payload: vote,
        })

        const state = voteReducer(removingState, {
            type: ADD_VOTE_ERROR,
            payload: { error: 'failed', voteToRestore: vote },
        })

        expect(state.currentUserVotes[vote.id]).toEqual({
            ...vote,
            pending: false,
        })
        expect(state.errorVotePost).toBe('failed')
    })
})
