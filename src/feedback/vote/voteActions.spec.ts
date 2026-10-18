import { beforeEach, describe, expect, test, vi } from 'vitest'
import { voteFor } from './voteActions'
import { voteReducer, type VoteState } from './voteReducer'
import { getVoteId } from './getVoteId'
import {
    VOTE_STATUS_ACTIVE,
    VOTE_STATUS_DELETED,
    VOTE_TYPE_BOOLEAN,
} from '../../core/contants'
import type { TFunction } from 'react-i18next'
import type { FirestoreDate, Vote, VoteItem } from '../../core/models'
import type { AppDispatch, RootState } from '../../store'

const firestoreSet = vi.hoisted(() => vi.fn())

vi.mock('../../firebase.ts', () => ({
    serverTimestamp: () => 'serverTimestamp',
    fireStoreMainInstance: {
        collection: () => ({
            doc: () => ({
                collection: () => ({
                    doc: () => ({ set: firestoreSet }),
                }),
            }),
        }),
    },
}))
vi.mock('./getVoteId', () => ({ getVoteId: vi.fn() }))
vi.mock('./actions/isVoteAllowed', () => ({ isVoteAllowed: () => true }))
vi.mock('./voteSelectors', () => ({}))
vi.mock('../project/projectSelectors', () => ({
    getProjectSelector: () => ({ id: 'p1', name: 'Project' }),
}))
vi.mock('../auth/authSelectors', () => ({
    getUserSelector: () => ({ uid: 'u1' }),
}))
vi.mock('../utils/track', () => ({ trackVote: vi.fn() }))

// Dates are irrelevant here
const date = {} as FirestoreDate

const voteItem: VoteItem = {
    id: 'vi1',
    type: VOTE_TYPE_BOOLEAN,
    name: 'Fun',
}

const deletedVote: Vote = {
    id: 'v1',
    projectId: 'p1',
    talkId: 't1',
    voteItemId: 'vi1',
    userId: 'u1',
    status: VOTE_STATUS_DELETED,
    createdAt: date,
    updatedAt: date,
}

/** Runs voteFor with a store holding only the vote reducer. */
const vote = async (initialVotes: VoteState['currentUserVotes']) => {
    let state: VoteState = {
        currentUserVotes: initialVotes,
        errorVotePost: null,
        errorVotesLoad: null,
    }
    const dispatch = vi.fn((action) => {
        state = voteReducer(state, action)
    }) as unknown as AppDispatch
    const getState = () => ({}) as RootState

    voteFor(
        't1',
        voteItem,
        null,
        ((key: string) => key) as TFunction
    )(dispatch, getState, undefined)
    // Let the rejected write settle
    await new Promise((resolve) => setTimeout(resolve))
    return state
}

beforeEach(() => {
    firestoreSet.mockReset()
    firestoreSet.mockRejectedValue(new Error('offline'))
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('voteFor write failure', () => {
    test('drops a new vote', async () => {
        vi.mocked(getVoteId).mockReturnValue(['new-id'])

        const state = await vote({})

        expect(state.currentUserVotes).toEqual({})
        expect(state.errorVotePost).toContain('offline')
    })

    test('restores the re-used vote document as it was', async () => {
        vi.mocked(getVoteId).mockReturnValue([deletedVote.id, deletedVote])

        const state = await vote({ [deletedVote.id]: deletedVote })

        expect(state.currentUserVotes[deletedVote.id]).toEqual(deletedVote)
        expect(state.currentUserVotes[deletedVote.id].status).not.toBe(
            VOTE_STATUS_ACTIVE
        )
        expect(state.errorVotePost).toContain('offline')
    })
})
