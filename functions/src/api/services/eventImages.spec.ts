import { describe, expect, it } from 'vitest'
import { findReplacedEventImages, parseStorageUrl } from './eventImages'

const bucket = 'openfeedback.appspot.com'
const publicUrl = (path: string, b = bucket) =>
    `https://storage.googleapis.com/${b}/${path}`
const downloadUrl = (path: string) =>
    `http://127.0.0.1:9199/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media&token=abc`

describe('parseStorageUrl', () => {
    it.each([
        [publicUrl('projects/ev/a_logo.png'), 'projects/ev/a_logo.png'],
        [downloadUrl('projects/ev/a logo.png'), 'projects/ev/a logo.png'],
    ])('parses %s', (url, path) => {
        expect(parseStorageUrl(url)).toEqual({ bucket, path })
    })

    it.each([
        undefined,
        '',
        'not a url',
        'https://openfeedback.io/favicon-32x32.png',
        'https://storage.googleapis.com/',
    ])('ignores %j', (url) => {
        expect(parseStorageUrl(url)).toBeNull()
    })
})

describe('findReplacedEventImages', () => {
    const find = (
        before: Record<string, unknown>,
        after: Record<string, unknown>
    ) => findReplacedEventImages('ev', bucket, before, after)

    it('returns event images whose URL changed', () => {
        expect(
            find(
                {
                    favicon: publicUrl('projects/ev/old_favicon.png'),
                    logoSmall: downloadUrl('projects/ev/old_logo.png'),
                },
                {
                    favicon: publicUrl('projects/ev/new_favicon.png'),
                    logoSmall: publicUrl('projects/ev/new_logo.png'),
                }
            )
        ).toEqual(['projects/ev/old_favicon.png', 'projects/ev/old_logo.png'])
    })

    it('keeps unchanged images', () => {
        const images = { favicon: publicUrl('projects/ev/f.png') }
        expect(find(images, images)).toEqual([])
    })

    it('keeps an image still used by the other field', () => {
        const shared = publicUrl('projects/ev/shared.png')
        expect(
            find(
                { favicon: shared, logoSmall: shared },
                { favicon: publicUrl('projects/ev/new.png'), logoSmall: shared }
            )
        ).toEqual([])
    })

    it('deletes a file used by both fields only once', () => {
        const shared = publicUrl('projects/ev/shared.png')
        const next = publicUrl('projects/ev/new.png')
        expect(
            find(
                { favicon: shared, logoSmall: shared },
                { favicon: next, logoSmall: next }
            )
        ).toEqual(['projects/ev/shared.png'])
    })

    it.each([
        ['an organization image', publicUrl('organizations/org/logo.png')],
        ['another event image', publicUrl('projects/other/logo.png')],
        ['an event with a prefixed ID', publicUrl('projects/ev2/logo.png')],
        ['a nested path', publicUrl('projects/ev/nested/logo.png')],
        ['another bucket', publicUrl('projects/ev/logo.png', 'other-bucket')],
        ['an external URL', 'https://example.com/logo.png'],
        ['the default app icon', 'https://openfeedback.io/favicon-32x32.png'],
    ])('never deletes %s', (_, url) => {
        expect(
            find(
                { favicon: url },
                { favicon: publicUrl('projects/ev/new.png') }
            )
        ).toEqual([])
    })
})
