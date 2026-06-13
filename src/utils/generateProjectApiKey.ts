const CHARACTERS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export const PROJECT_API_KEY_PREFIX = 'ofproj_'

/**
 * Generate a project API key using the browser CSPRNG (Web Crypto).
 *
 * Format matches the backend generator (`ofproj_` + alphanumeric string).
 * Uses rejection sampling so each character is uniformly distributed (no
 * modulo bias). Never use Math.random() for credentials.
 */
export const generateProjectApiKey = (length = 48): string => {
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

    return PROJECT_API_KEY_PREFIX + result.join('')
}
