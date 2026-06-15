import { describe, it, expect } from 'vitest'
import { normalizeEventData, parseEventJson } from './eventDataNormalization'

describe('normalizeEventData', () => {
    it('coerces numeric session and speaker ids to strings', () => {
        // Numeric ids are common in real exports; cast to feed bad input.
        const result = normalizeEventData({
            sessions: { 2: { id: 2, title: 'Talk', speakers: ['s1'] } },
            speakers: { s1: { id: 's1', name: 'Jane' } },
        } as never)

        expect(result.sessions?.['2'].id).toBe('2')
        expect(typeof result.sessions?.['2'].id).toBe('string')
        expect(result.speakers?.['s1'].id).toBe('s1')
    })

    it('keeps only string entries in speakers and tags arrays', () => {
        const result = normalizeEventData({
            sessions: {
                t1: {
                    id: 't1',
                    speakers: ['s1', 42, null, 's2'],
                    tags: ['a', {}, 'b'],
                },
            },
            speakers: {},
        })

        expect(result.sessions?.['t1'].speakers).toEqual(['s1', 's2'])
        expect(result.sessions?.['t1'].tags).toEqual(['a', 'b'])
    })

    it('leaves non-array speakers/tags untouched', () => {
        const result = normalizeEventData({
            sessions: { t1: { id: 't1' } },
            speakers: {},
        })
        expect(result.sessions?.['t1'].speakers).toBeUndefined()
        expect(result.sessions?.['t1'].tags).toBeUndefined()
    })

    it('returns empty objects for missing sessions/speakers', () => {
        const result = normalizeEventData({})
        expect(result.sessions).toEqual({})
        expect(result.speakers).toEqual({})
    })
})

describe('parseEventJson', () => {
    it('returns null data and no error for empty input', () => {
        expect(parseEventJson('')).toEqual({ data: null, error: null })
        expect(parseEventJson('   ')).toEqual({ data: null, error: null })
    })

    it('returns an error for invalid JSON', () => {
        const { data, error } = parseEventJson('{ not json')
        expect(data).toBeNull()
        expect(error).toBeTruthy()
    })

    it('rejects JSON that is not an object', () => {
        expect(parseEventJson('[]').error).toBeTruthy()
        expect(parseEventJson('"hello"').error).toBeTruthy()
        expect(parseEventJson('42').error).toBeTruthy()
    })

    it('parses and normalizes a valid event object', () => {
        const { data, error } = parseEventJson(
            JSON.stringify({
                sessions: { 1: { id: 1, title: 'Hi', speakers: ['s1'] } },
                speakers: { s1: { id: 's1', name: 'Jane' } },
            })
        )
        expect(error).toBeNull()
        expect(data?.sessions?.['1'].id).toBe('1')
        expect(data?.speakers?.['s1'].name).toBe('Jane')
    })
})
