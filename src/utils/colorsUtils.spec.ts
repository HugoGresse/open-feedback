import { afterEach, describe, expect, it, vi } from 'vitest'
import { newRandomHexColor } from './colorsUtils'

describe('newRandomHexColor', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it.each([
        [0, '000000'],
        [0.05, '0ccccc'],
        [0.5, '800000'],
        [0.999999999, 'ffffff'],
    ])('maps Math.random() %s to %s', (random, expected) => {
        vi.spyOn(Math, 'random').mockReturnValue(random)
        expect(newRandomHexColor()).toBe(expected)
    })
})
