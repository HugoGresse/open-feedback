import { describe, expect, it } from 'vitest'
import { isValidEmailAddress } from './isValidEmailAddress'

describe('isValidEmailAddress', () => {
    it.each([
        'first.last+tag@sub.example.co',
        "o'brien@example.com",
        'Visitor@Example.COM',
    ])('accepts %s', (address) => {
        expect(isValidEmailAddress(address)).toBe(true)
    })

    it.each([
        '',
        'visitor',
        'visitor@example',
        'visitor@example.com.',
        'a@b@example.com',
        'a@example.com\r\nBcc: b@example.com',
        'a@example.com\u0000',
        `a@exa${String.fromCodePoint(0x200b)}mple.com`, // zero-width space
        `${'a'.repeat(250)}@example.com`,
        42,
        undefined,
        ['a@example.com'],
    ])('rejects %j', (address) => {
        expect(isValidEmailAddress(address)).toBe(false)
    })

    // Each of these would turn the value into a list, a display name or a
    // quoted string in a header
    it.each([...' <>(),;:"'])('rejects %j in the address', (char) => {
        expect(isValidEmailAddress(`a${char}b@example.com`)).toBe(false)
        expect(isValidEmailAddress(`ab@exa${char}mple.com`)).toBe(false)
    })
})
