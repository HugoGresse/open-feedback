import { describe, expect, test } from 'vitest'
import { getProjectRedirectUrl } from './redirectToProject'

describe('getProjectRedirectUrl', () => {
    test.each([
        ['/admin/', null, 'abc', '/admin/event/abc'],
        // "min" is a substring of "/admin/" but not a segment of it
        ['/admin/', null, 'min', '/admin/event/min'],
        ['/admin/event/abc/talks/', null, 'abc', null],
        ['/admin/event/abc/talks/', 'abc', 'abc', null],
        ['/admin/event/abc/talks/', 'abc', 'xyz', '/admin/event/xyz/talks/'],
        ['/admin/event/adm/talks/', 'adm', 'xyz', '/admin/event/xyz/talks/'],
    ])('from %s (current %s) to %s: %s', (pathname, current, next, url) => {
        expect(getProjectRedirectUrl(pathname, current, next)).toBe(url)
    })
})
