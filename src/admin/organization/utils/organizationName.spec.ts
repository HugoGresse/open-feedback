import { describe, expect, test } from 'vitest'
import {
    getOrganizationNameToSave,
    isOrganizationDeleteConfirmed,
} from './organizationName'

describe('getOrganizationNameToSave', () => {
    test('returns the trimmed new name', () => {
        expect(getOrganizationNameToSave('Old', '  New name ')).toBe('New name')
    })

    test('returns null when the name is unchanged', () => {
        expect(getOrganizationNameToSave('Same', 'Same')).toBeNull()
        expect(getOrganizationNameToSave('Same', ' Same  ')).toBeNull()
    })

    test('returns null when the name is empty', () => {
        expect(getOrganizationNameToSave('Old', '')).toBeNull()
        expect(getOrganizationNameToSave('Old', '   ')).toBeNull()
    })
})

describe('isOrganizationDeleteConfirmed', () => {
    test('requires the exact organization name', () => {
        expect(isOrganizationDeleteConfirmed('My org', 'My org')).toBe(true)
        expect(isOrganizationDeleteConfirmed('My org', ' My org ')).toBe(true)
        expect(isOrganizationDeleteConfirmed('My org', 'my org')).toBe(false)
        expect(isOrganizationDeleteConfirmed('My org', 'My')).toBe(false)
    })

    test('is never confirmed for an empty name', () => {
        expect(isOrganizationDeleteConfirmed('', '')).toBe(false)
        expect(isOrganizationDeleteConfirmed(' ', ' ')).toBe(false)
    })
})
