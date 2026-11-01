import { describe, expect, test, vi } from 'vitest'
import { voteReducer, type VoteState } from './voteReducer'
import {
    ADD_VOTE_ERROR,
    GET_USER_VOTES_ERROR,
    GET_USER_VOTES_SUCCESS,
    REMOVE_VOTE_BEFORE_SUCCESS,
} from './voteActionTypes'
import { VOTE_STATUS_ACTIVE } from '../../core/contants'
import type { FirestoreDate, Vote } from '../../core/models'
import type firebase from 'firebase/compat/app'

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
    userVotesSettled: true,
    errorVotePost: null,
    errorVotesLoad: null,
}

describe('voteReducer user votes loading', () => {
    const notLoaded: VoteState = {
        currentUserVotes: {},
        userVotesSettled: false,
        errorVotePost: null,
        errorVotesLoad: null,
    }

    test('marks the user votes as loaded', () => {
        const state = voteReducer(notLoaded, {
            type: GET_USER_VOTES_SUCCESS,
            payload: { [vote.id]: vote },
        })

        expect(state.userVotesSettled).toBe(true)
        expect(state.currentUserVotes).toEqual({ [vote.id]: vote })
    })

    test('settles the user votes, left empty, when they fail to load', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined)
        const state = voteReducer(notLoaded, {
            type: GET_USER_VOTES_ERROR,
            payload: {
                toString: () => 'failed',
            } as firebase.firestore.FirestoreError,
        })

        expect(state.userVotesSettled).toBe(true)
        expect(state.currentUserVotes).toEqual({})
        expect(state.errorVotesLoad).toBe('failed')
    })
})

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
