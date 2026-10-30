import { describe, expect, test } from 'vitest'
import { isComposingKeyEvent } from './isComposingKeyEvent'

describe('isComposingKeyEvent', () => {
    test('is true during an IME composition', () => {
        expect(
            isComposingKeyEvent({
                nativeEvent: { isComposing: true },
                keyCode: 13,
            })
        ).toBe(true)
        // Safari
        expect(
            isComposingKeyEvent({
                nativeEvent: { isComposing: false },
                keyCode: 229,
            })
        ).toBe(true)
    })

    test('is false for a regular key press', () => {
        expect(
            isComposingKeyEvent({
                nativeEvent: { isComposing: false },
                keyCode: 13,
            })
        ).toBe(false)
    })
})
