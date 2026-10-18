import { DateTime } from 'luxon'

/**
 * The date-time an empty picker opens on (x-date-pickers `referenceDate`),
 * from an ISO string, to the minute. Undefined when missing or invalid.
 */
export const toReferenceDate = (
    isoDate: string | null | undefined
): DateTime | undefined => {
    if (!isoDate) {
        return undefined
    }
    // Picking a day copies the reference time: no stray seconds in the value
    const date = DateTime.fromISO(isoDate).startOf('minute')
    return date.isValid ? date : undefined
}
