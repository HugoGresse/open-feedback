/**
 * Return a random int number between the two provided offset (included
 * @param min minimum int value (random will include it)
 * @param max maximum int value (random will include it)
 */
export const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min)
