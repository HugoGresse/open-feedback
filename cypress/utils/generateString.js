export const stringGenerator = (long = false) =>
    Math.random().toString(36).substring(2, 15) + long
        ? ' ' + Math.random().toString(36).substring(2, 15)
        : ''
