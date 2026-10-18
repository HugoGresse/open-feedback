// From https://stackoverflow.com/a/1527820/1377145

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min
}
