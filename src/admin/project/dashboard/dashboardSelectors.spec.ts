import { describe, expect, it, vi } from 'vitest'
import { getTotalVoterCountSelector } from './dashboardSelectors'
import type { DashboardUserVote } from './dashboardActionTypes'

// The selectors import the store, which initializes Firebase.
vi.mock('../../../firebase.ts', () => ({}))

const vote = (userId: string) => ({ userId }) as DashboardUserVote

describe('getTotalVoterCountSelector', () => {
    it('counts each user once', () => {
        expect(
            getTotalVoterCountSelector.resultFunc([
                vote('a'),
                vote('b'),
                vote('a'),
            ])
        ).toBe(2)
    })

    it('is 0 without votes', () => {
        expect(getTotalVoterCountSelector.resultFunc([])).toBe(0)
    })
})
