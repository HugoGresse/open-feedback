/**
 * The number of circles to draw for a vote count. Aggregated counts can be
 * negative, NaN or not integers, which `Array(n)` and `array.length = n`
 * reject with a RangeError.
 */
export const clampCircleCount = (count: number): number =>
    Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0
