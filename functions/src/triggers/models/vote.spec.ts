import { describe, expect, it } from 'vitest'
import { FieldValue } from 'firebase-admin/firestore'
import { type AggregatedVote, getAggregatedTextVotes } from './AggregatedVote'
import {
    VOTE_STATUS_ACTIVE,
    VOTE_TYPE_TEXT_PLUS,
    Vote,
    type VoteData,
} from './vote'

const textVote = {
    text: 'nice talk',
    createdAt: {},
    updatedAt: {},
    userId: 'u1',
    plus: 2,
}

describe('getAggregatedTextVotes', () => {
    it('returns the text votes of a text vote item', () => {
        expect(
            getAggregatedTextVotes({ vi1: { t1: textVote } }, 'vi1')
        ).toEqual({ t1: textVote })
    })

    it('returns undefined for a boolean vote item count', () => {
        expect(getAggregatedTextVotes({ vi1: 3 }, 'vi1')).toBeUndefined()
    })

    it('returns undefined without an aggregate or vote item', () => {
        expect(getAggregatedTextVotes(undefined, 'vi1')).toBeUndefined()
        expect(getAggregatedTextVotes({}, 'vi1')).toBeUndefined()
    })
})

describe('Vote.getVoteItemIncrementAggregation for an up-vote on a text', () => {
    const upVote = new Vote('v1', {
        projectId: 'p1',
        talkId: 's1',
        voteItemId: 'vi1',
        userId: 'u2',
        voteId: 't1',
        voteType: VOTE_TYPE_TEXT_PLUS,
        status: VOTE_STATUS_ACTIVE,
        createdAt: {},
        updatedAt: {},
    } satisfies VoteData)

    it('increments the plus of an existing text vote', () => {
        expect(
            upVote.getVoteItemIncrementAggregation({ vi1: { t1: textVote } })
        ).toEqual({ vi1: { t1: { plus: FieldValue.increment(1) } } })
    })

    it.each<[string, AggregatedVote | undefined]>([
        ['no aggregate', undefined],
        ['no text vote', { vi1: {} }],
        ['a deleted text vote', { vi1: { t1: {} } }],
        ['a vote item holding a count', { vi1: 3 }],
    ])('ignores the up-vote with %s', (_, aggregatedVote) => {
        expect(upVote.getVoteItemIncrementAggregation(aggregatedVote)).toEqual(
            {}
        )
    })
})

describe('Vote.getVoteItemIncrementAggregation for a text vote', () => {
    const vote = new Vote('t1', {
        projectId: 'p1',
        talkId: 's1',
        voteItemId: 'vi1',
        userId: 'u1',
        text: 'edited',
        status: VOTE_STATUS_ACTIVE,
        createdAt: {},
        updatedAt: {},
    } satisfies VoteData)
    const written = {
        text: 'edited',
        createdAt: {},
        updatedAt: {},
        userId: 'u1',
    }

    it('keeps the up-votes of an existing text vote', () => {
        expect(
            vote.getVoteItemIncrementAggregation({ vi1: { t1: textVote } })
        ).toEqual({ vi1: { t1: written } })
    })

    it('starts at one up-vote when the vote item holds a count', () => {
        expect(vote.getVoteItemIncrementAggregation({ vi1: 3 })).toEqual({
            vi1: { t1: { ...written, plus: 1 } },
        })
    })
})
