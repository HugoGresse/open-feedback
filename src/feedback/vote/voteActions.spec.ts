import { beforeEach, describe, expect, test, vi } from 'vitest'
import { removeVote, voteFor } from './voteActions'
import { voteReducer, type VoteState } from './voteReducer'
import { projectReducer, type ProjectState } from '../project/projectReducer'
import { getVoteId } from './getVoteId'
import {
    VOTE_STATUS_ACTIVE,
    VOTE_STATUS_DELETED,
    VOTE_STATUS_HIDDEN,
    VOTE_TYPE_BOOLEAN,
    VOTE_TYPE_TEXT,
} from '../../core/contants'
import type { TFunction } from 'react-i18next'
import type {
    AggregatedTextVotes,
    FirestoreDate,
    Vote,
    VoteItem,
} from '../../core/models'
import type { AppDispatch, RootState } from '../../store'

const firestoreSet = vi.hoisted(() => vi.fn())

vi.mock('../../firebase.ts', () => ({
    serverTimestamp: () => 'serverTimestamp',
    nowTimestamp: () => 'now',
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
vi.mock('./voteSelectors', () => ({
    getCurrentUserVotesSelector: (state: RootState) =>
        state.votes.currentUserVotes,
}))
vi.mock('../project/projectSelectors', () => ({
    getProjectSelector: () => ({ id: 'p1', name: 'Project' }),
}))
vi.mock('../auth/authSelectors', () => ({
    getUserSelector: () => ({ uid: 'u1' }),
}))
vi.mock('../utils/track', () => ({ trackVote: vi.fn(), trackUnvote: vi.fn() }))

const translate = ((key: string) => key) as TFunction

// Dates are irrelevant here
const date = {} as FirestoreDate

const booleanItem: VoteItem = {
    id: 'vi1',
    type: VOTE_TYPE_BOOLEAN,
    name: 'Fun',
}

const textItem: VoteItem = {
    id: 'vi2',
    type: VOTE_TYPE_TEXT,
    name: 'Comment',
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

const textVote: Vote = {
    id: 'c1',
    projectId: 'p1',
    talkId: 't1',
    voteItemId: 'vi2',
    userId: 'u1',
    status: VOTE_STATUS_ACTIVE,
    text: 'old',
    createdAt: date,
    updatedAt: date,
}

/** The aggregated results of the text vote item: the comment has 5 votes. */
const textResults = (): AggregatedTextVotes => ({
    c1: { text: 'old', plus: 5, userId: 'u1' },
})

// An action the project reducer ignores, to read its initial state
const INIT_ACTION = { type: '@@init' } as never

/** A store holding the vote and project (aggregated results) reducers. */
const createStore = (currentUserVotes: VoteState['currentUserVotes']) => {
    let votes: VoteState = {
        currentUserVotes,
        errorVotePost: null,
        errorVotesLoad: null,
    }
    let project: ProjectState = {
        ...projectReducer(undefined, INIT_ACTION),
        talkVotes: { t1: { vi2: textResults() } },
    }
    const dispatch = vi.fn((action) => {
        votes = voteReducer(votes, action)
        project = projectReducer(project, action)
    }) as unknown as AppDispatch
    const getState = () => ({ votes, project }) as unknown as RootState
    return {
        dispatch,
        getState,
        votes: () => votes.currentUserVotes,
        results: () => project.talkVotes?.t1?.vi2 as AggregatedTextVotes,
    }
}

/** Lets the mocked write settle. */
const settle = () => new Promise((resolve) => setTimeout(resolve))

beforeEach(() => {
    firestoreSet.mockReset()
    firestoreSet.mockRejectedValue(new Error('offline'))
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('voteFor write failure', () => {
    test('drops a new vote', async () => {
        vi.mocked(getVoteId).mockReturnValue(['new-id'])
        const store = createStore({})

        voteFor(
            't1',
            booleanItem,
            null,
            translate
        )(store.dispatch, store.getState, undefined)
        await settle()

        expect(store.votes()).toEqual({})
    })

    test('restores the re-used vote document as it was', async () => {
        vi.mocked(getVoteId).mockReturnValue([deletedVote.id, deletedVote])
        const store = createStore({ [deletedVote.id]: deletedVote })

        voteFor(
            't1',
            booleanItem,
            null,
            translate
        )(store.dispatch, store.getState, undefined)
        await settle()

        expect(store.votes()[deletedVote.id]).toEqual({
            ...deletedVote,
            pending: false,
        })
    })

    test('keeps the edited comment and its votes in the results', async () => {
        vi.mocked(getVoteId).mockReturnValue([textVote.id, textVote])
        const store = createStore({ [textVote.id]: textVote })

        voteFor(
            't1',
            textItem,
            'new',
            translate
        )(store.dispatch, store.getState, undefined)
        await settle()

        expect(store.votes()[textVote.id]).toEqual({
            ...textVote,
            pending: false,
        })
        expect(store.results().c1).toMatchObject({ text: 'old', plus: 5 })
    })
})

describe('voteFor on an existing comment', () => {
    test('keeps the votes of an edited comment', async () => {
        firestoreSet.mockResolvedValue(undefined)
        vi.mocked(getVoteId).mockReturnValue([textVote.id, textVote])
        const store = createStore({ [textVote.id]: textVote })

        voteFor(
            't1',
            textItem,
            'new',
            translate
        )(store.dispatch, store.getState, undefined)
        await settle()

        expect(store.results().c1).toMatchObject({ text: 'new', plus: 5 })
    })

    test('keeps a comment hidden by the moderation hidden', async () => {
        firestoreSet.mockResolvedValue(undefined)
        const hiddenVote: Vote = { ...textVote, status: VOTE_STATUS_HIDDEN }
        vi.mocked(getVoteId).mockReturnValue([hiddenVote.id, hiddenVote])
        const store = createStore({ [hiddenVote.id]: hiddenVote })
        const resultsBefore = store.results()

        voteFor(
            't1',
            textItem,
            'edited',
            translate
        )(store.dispatch, store.getState, undefined)
        await settle()

        expect(firestoreSet.mock.calls[0][0].status).toBe(VOTE_STATUS_HIDDEN)
        expect(store.results()).toBe(resultsBefore)
    })
})

describe('removeVote write failure', () => {
    test('restores the vote of the store, not an older copy', async () => {
        const editedVote: Vote = { ...textVote, text: 'edited' }
        const store = createStore({ [textVote.id]: editedVote })

        // The comment field still holds the vote loaded before the edit
        removeVote(textVote, translate)(
            store.dispatch,
            store.getState,
            undefined
        )
        await settle()

        expect(store.votes()[textVote.id]).toEqual({
            ...editedVote,
            pending: false,
        })
        expect(store.results().c1).toMatchObject({ text: 'edited' })
    })
})
