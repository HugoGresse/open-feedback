import { describe, expect, test } from 'vitest'
import { clampCircleCount } from './clampCircleCount'

describe('clampCircleCount', () => {
    test('keeps a positive integer count', () => {
        expect(clampCircleCount(0)).toBe(0)
        expect(clampCircleCount(12)).toBe(12)
    })

    test('clamps a negative count to zero', () => {
        expect(clampCircleCount(-3)).toBe(0)
    })

    test('clamps a NaN or infinite count to zero', () => {
        expect(clampCircleCount(NaN)).toBe(0)
        expect(clampCircleCount(Infinity)).toBe(0)
    })

    test('rounds a decimal count down', () => {
        expect(clampCircleCount(2.7)).toBe(2)
    })

    test('always gives a valid array length', () => {
        for (const count of [-1, NaN, 1.5, Infinity, -Infinity]) {
            expect(() => {
                const circles: number[] = []
                circles.length = clampCircleCount(count)
            }).not.toThrow()
        }
    })
})
