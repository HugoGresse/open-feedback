import { DateTime } from 'luxon'

/**
 * The date-time an empty picker opens on (x-date-pickers `referenceDate`),
 * from an ISO string. Undefined when missing or invalid.
 */
export const toReferenceDate = (
    isoDate: string | null | undefined
): DateTime | undefined => {
    if (!isoDate) {
        return undefined
    }
    const date = DateTime.fromISO(isoDate)
    return date.isValid ? date : undefined
}
