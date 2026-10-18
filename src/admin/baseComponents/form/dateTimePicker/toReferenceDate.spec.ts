import { describe, expect, test } from 'vitest'
import { toReferenceDate } from './toReferenceDate'

describe('toReferenceDate', () => {
    test('parses an ISO date-time', () => {
        expect(toReferenceDate('2026-06-27T16:20:00.000Z')?.toMillis()).toBe(
            Date.parse('2026-06-27T16:20:00.000Z')
        )
    })

    test('ignores a missing or invalid date', () => {
        expect(toReferenceDate(undefined)).toBeUndefined()
        expect(toReferenceDate(null)).toBeUndefined()
        expect(toReferenceDate('')).toBeUndefined()
        expect(toReferenceDate('not a date')).toBeUndefined()
    })
})
