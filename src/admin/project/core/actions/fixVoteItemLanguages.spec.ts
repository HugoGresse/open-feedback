import { describe, expect, test } from 'vitest'
import { fixVoteItemLanguages } from './fixVoteItemLanguages'
import type { VoteItem } from '../../../../core/models'

const voteItem = (languages?: Record<string, string>): VoteItem => ({
    id: 'vi1',
    type: 'boolean',
    name: 'Fun',
    languages,
})

describe('fixVoteItemLanguages', () => {
    test('removes the translations of the removed languages', () => {
        const result = fixVoteItemLanguages(
            ['fr'],
            [voteItem({ fr: 'Drôle', de: 'Lustig' })]
        )

        expect(result.voteItems?.[0].languages).toEqual({ fr: 'Drôle' })
    })

    test('does not mutate the given vote items', () => {
        const items = [voteItem({ fr: 'Drôle', de: 'Lustig' })]
        Object.freeze(items[0].languages)

        fixVoteItemLanguages(['fr'], items)

        expect(items[0].languages).toEqual({ fr: 'Drôle', de: 'Lustig' })
    })

    test('keeps vote items without translations', () => {
        const item = voteItem()
        expect(fixVoteItemLanguages(['fr'], [item]).voteItems).toEqual([item])
    })

    test('changes nothing without languages or vote items', () => {
        expect(fixVoteItemLanguages(undefined, [voteItem()])).toEqual({})
        expect(fixVoteItemLanguages(['fr'], [])).toEqual({})
    })
})
