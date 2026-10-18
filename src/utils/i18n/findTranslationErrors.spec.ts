import { describe, expect, it } from 'vitest'
import { findTranslationErrors } from './findTranslationErrors'

// Every translation file of the apps, keyed by its path.
const languageFiles = import.meta.glob<Record<string, unknown>>(
    '../../*/translations/languages/*.json',
    { eager: true, import: 'default' }
)

describe('findTranslationErrors', () => {
    it('accepts a translation with the same keys', () => {
        expect(
            findTranslationErrors(
                { a: 'A', b: { c: 'C' } },
                { a: 'Á', b: { c: 'Ç' } }
            )
        ).toEqual([])
    })

    it('reports missing and extra keys with their path', () => {
        expect(
            findTranslationErrors(
                { a: 'A', b: { c: 'C' } },
                { b: { d: 'D' }, e: 'E' }
            )
        ).toEqual([
            'a: missing',
            'b.c: missing',
            'b.d: not in English',
            'e: not in English',
        ])
    })

    it('reports empty strings and wrong types', () => {
        expect(
            findTranslationErrors(
                { a: 'A', b: 'B', c: { d: 'D' } },
                { a: ' ', b: 2, c: 'D' }
            )
        ).toEqual([
            'a: expected a non-empty string',
            'b: expected a non-empty string',
            'c: expected an object',
        ])
    })
})

describe('translation files', () => {
    const files = Object.entries(languageFiles)

    it('are found', () => {
        expect(files.length).toBeGreaterThanOrEqual(6)
    })

    it.each(files.filter(([path]) => !path.includes('/en.')))(
        '%s matches its English source',
        (path, translation) => {
            const englishPath = path.replace(
                /\/[a-z-]+\.(\w+)\.json$/,
                '/en.$1.json'
            )
            expect(languageFiles[englishPath]).toBeDefined()
            expect(
                findTranslationErrors(languageFiles[englishPath], translation)
            ).toEqual([])
        }
    )

    it.each(files.filter(([path]) => path.includes('/en.')))(
        '%s has only non-empty strings',
        (_path, english) => {
            expect(findTranslationErrors(english, english)).toEqual([])
        }
    )
})
