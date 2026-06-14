const CHARACTERS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export const PROJECT_API_KEY_PREFIX = 'ofproj_'
export const ORG_API_KEY_PREFIX = 'oforg_'

/**
 * Generate an API key using the browser CSPRNG (Web Crypto).
 *
 * Format matches the backend generator (`<prefix>` + alphanumeric string).
 * Uses rejection sampling so each character is uniformly distributed (no
 * modulo bias). Never use Math.random() for credentials.
 */
export const generateApiKey = (prefix: string, length = 48): string => {
    const max = 256 - (256 % CHARACTERS.length)
    const result: string[] = []

    while (result.length < length) {
        const bytes = new Uint8Array(length - result.length)
        crypto.getRandomValues(bytes)
        for (const byte of bytes) {
            // Drop the few high bytes that would skew the distribution.
            if (byte < max) {
                result.push(CHARACTERS[byte % CHARACTERS.length])
            }
        }
    }

    return prefix + result.join('')
}

/** Project (event) API key: `ofproj_` + alphanumeric. */
export const generateProjectApiKey = (length = 48): string =>
    generateApiKey(PROJECT_API_KEY_PREFIX, length)

/** Organization API key: `oforg_` + alphanumeric. */
export const generateOrgApiKey = (length = 48): string =>
    generateApiKey(ORG_API_KEY_PREFIX, length)
