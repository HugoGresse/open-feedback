import { describe, it, expect, vi } from 'vitest'

vi.mock('../../../firebase.ts', () => ({ fireStoreMainInstance: {} }))

import {
    countTalkVotes,
    countTalkVotesAndComments,
    shouldConfirmTalkRemoval,
} from './talkVoteCount'

describe('countTalkVotes', () => {
    it('returns 0 when the talk has no vote document', () => {
        expect(countTalkVotes(undefined)).toBe(0)
        expect(countTalkVotes(null)).toBe(0)
        expect(countTalkVotes({})).toBe(0)
    })

    it('sums counter vote items', () => {
        expect(countTalkVotes({ fun: 3, clear: 2 })).toBe(5)
    })

    it('counts each text vote as one vote', () => {
        expect(
            countTalkVotes({
                fun: 1,
                comment: { a: { text: 'nice' }, b: { text: 'great' } },
            })
        ).toBe(3)
    })

    it('ignores deleted text votes left as empty objects', () => {
        expect(countTalkVotes({ comment: { a: {}, b: { text: 'ok' } } })).toBe(
            1
        )
    })

    it('reports comments separately', () => {
        expect(
            countTalkVotesAndComments({ fun: 2, comment: { a: { text: 'x' } } })
        ).toEqual({ votes: 3, comments: 1 })
    })

    it('ignores counters that were decremented below zero', () => {
        expect(countTalkVotes({ fun: 0, clear: -1 })).toBe(0)
    })
})

describe('shouldConfirmTalkRemoval', () => {
    it('deletes directly only when the talk has no vote', () => {
        expect(shouldConfirmTalkRemoval(0)).toBe(false)
        expect(shouldConfirmTalkRemoval(2)).toBe(true)
    })

    it('asks for confirmation when the vote count is unknown', () => {
        expect(shouldConfirmTalkRemoval(null)).toBe(true)
    })
})
