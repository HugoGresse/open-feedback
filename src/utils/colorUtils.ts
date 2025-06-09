/**
 * Inverts a hex color value
 * @param hex - Hex color string (e.g., '#000000' or '000000')
 * @returns Inverted hex color string
 */
export const invertColor = (hex: string): string => {
    // Remove hash if present
    const cleanHex = hex.replace('#', '')

    // Validate hex color
    if (!/^[0-9A-F]{6}$/i.test(cleanHex)) {
        throw new Error('Invalid hex color format')
    }

    // Convert hex to RGB, invert, and convert back to hex
    const r = 255 - parseInt(cleanHex.slice(0, 2), 16)
    const g = 255 - parseInt(cleanHex.slice(2, 4), 16)
    const b = 255 - parseInt(cleanHex.slice(4, 6), 16)

    // Convert back to hex and ensure 2 digits
    const invertedR = r.toString(16).padStart(2, '0')
    const invertedG = g.toString(16).padStart(2, '0')
    const invertedB = b.toString(16).padStart(2, '0')

    return `#${invertedR}${invertedG}${invertedB}`
}
