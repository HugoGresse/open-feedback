import { describe, expect, test } from 'vitest'
import {
    shouldShowVoteResults,
    snapshotVotedOnTalkAtLoad,
} from './voteResultsVisibility'
import { VOTE_STATUS_ACTIVE } from '../../../core/contants'
import type { FirestoreDate, Vote } from '../../../core/models'

// Dates are irrelevant to the visibility
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

describe('snapshotVotedOnTalkAtLoad', () => {
    test('waits for the user votes to be loaded', () => {
        expect(snapshotVotedOnTalkAtLoad(null, 't1', false, {})).toBeNull()
        expect(
            snapshotVotedOnTalkAtLoad(null, 't1', false, { vi1: [vote] })
        ).toBeNull()
    })

    test('marks the talk as voted when the user has votes on it', () => {
        expect(
            snapshotVotedOnTalkAtLoad(null, 't1', true, { vi1: [vote] })
        ).toEqual({ talkId: 't1', voted: true })
    })

    test('marks the talk as not voted without user votes on it', () => {
        expect(snapshotVotedOnTalkAtLoad(null, 't1', true, {})).toEqual({
            talkId: 't1',
            voted: false,
        })
        expect(
            snapshotVotedOnTalkAtLoad(null, 't1', true, { vi1: [] })
        ).toEqual({ talkId: 't1', voted: false })
    })

    test('keeps the snapshot when the user votes during the visit', () => {
        const previous = { talkId: 't1', voted: false }

        expect(
            snapshotVotedOnTalkAtLoad(previous, 't1', true, { vi1: [vote] })
        ).toBe(previous)
    })

    test('takes a new snapshot when the talk changes', () => {
        const previous = { talkId: 't1', voted: false }

        expect(
            snapshotVotedOnTalkAtLoad(previous, 't2', true, { vi1: [vote] })
        ).toEqual({ talkId: 't2', voted: true })
        expect(snapshotVotedOnTalkAtLoad(previous, 't2', false, {})).toBeNull()
    })
})

describe('shouldShowVoteResults', () => {
    const hidden = {
        hideVotesUntilUserVote: true,
        displayVotes: null,
        votedOnTalkAtLoad: false,
        voteWindowOpen: true,
    }

    test('hides the results until the user loads the talk after voting', () => {
        expect(shouldShowVoteResults(hidden)).toBe(false)
        expect(
            shouldShowVoteResults({ ...hidden, votedOnTalkAtLoad: true })
        ).toBe(true)
    })

    test('shows the results when the setting is off', () => {
        expect(
            shouldShowVoteResults({ ...hidden, hideVotesUntilUserVote: false })
        ).toBe(true)
        expect(
            shouldShowVoteResults({
                ...hidden,
                hideVotesUntilUserVote: undefined,
            })
        ).toBe(true)
    })

    test('shows the results with the displayVotes URL parameter', () => {
        expect(shouldShowVoteResults({ ...hidden, displayVotes: 'true' })).toBe(
            true
        )
    })

    test('shows the results outside of the vote window', () => {
        expect(
            shouldShowVoteResults({ ...hidden, voteWindowOpen: false })
        ).toBe(true)
    })
})
