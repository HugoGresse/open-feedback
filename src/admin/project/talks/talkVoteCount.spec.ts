import { describe, it, expect, vi } from 'vitest'

vi.mock('../../../firebase.ts', () => ({ fireStoreMainInstance: {} }))

import { countTalkVotes } from './talkVoteCount'

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

    it('ignores counters that were decremented below zero', () => {
        expect(countTalkVotes({ fun: 0, clear: -1 })).toBe(0)
    })
})
