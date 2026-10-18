type TranslationTree = { [key: string]: unknown }

const isTree = (value: unknown): value is TranslationTree =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Compare a translation file with its English reference: both must have the
 * same keys, and every translation must be a non-empty string.
 * Returns one message per problem, with the dotted key path.
 */
export const findTranslationErrors = (
    reference: unknown,
    translation: unknown,
    path = ''
): string[] => {
    if (!isTree(reference) || !isTree(translation)) {
        return [`${path || '<root>'}: expected an object`]
    }

    const errors: string[] = []
    for (const key of Object.keys(reference)) {
        const keyPath = path ? `${path}.${key}` : key
        if (!(key in translation)) {
            errors.push(`${keyPath}: missing`)
            continue
        }
        const referenceValue = reference[key]
        const value = translation[key]
        if (isTree(referenceValue)) {
            errors.push(
                ...findTranslationErrors(referenceValue, value, keyPath)
            )
        } else if (typeof value !== 'string' || value.trim() === '') {
            errors.push(`${keyPath}: expected a non-empty string`)
        }
    }
    for (const key of Object.keys(translation)) {
        if (!(key in reference)) {
            errors.push(`${path ? `${path}.${key}` : key}: not in English`)
        }
    }
    return errors
}
