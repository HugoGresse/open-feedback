/**
 * The name to save once the inline edit of the organization name ends, or null
 * when there is nothing to save (empty or unchanged name).
 */
export const getOrganizationNameToSave = (
    currentName: string,
    draftName: string
): string | null => {
    const name = draftName.trim()
    if (!name || name === currentName.trim()) {
        return null
    }
    return name
}

/** The delete confirmation requires the exact organization name to be typed. */
export const isOrganizationDeleteConfirmed = (
    organizationName: string,
    typedName: string
): boolean =>
    organizationName.trim().length > 0 &&
    typedName.trim() === organizationName.trim()
