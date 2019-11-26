export const normalizeAndRemoveDiacritics = value => {
    if (!value) {
        return value
    }
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const newId = () => {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let autoId = ''
    for (let i = 0; i < 20; i++) {
        autoId += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return autoId
}

/**
 * Example usage:

 sprintf('The quick %s %s jumps over the lazy %s', [
 'brown',
 'fox',
 'dog'
 ]);

 Would output:

 "The quick brown fox jumps over the lazy dog"

 From https://stackoverflow.com/a/20218801/1377145

 * @param  {String} template
 * @param  values
 * @return {String}
 */
export const sprintf = (template, ...values) =>
    template.replace(/%s/g, () => values.shift())

/**
 * Generate a hash from a string
 * From https://stackoverflow.com/a/7616484/1377145
 * @param value
 * @returns {number}
 */
export const hashString = value => {
    if (!value) {
        return 0
    }
    let hash = 0,
        i,
        chr
    if (value.length === 0) return hash
    for (i = 0; i < value.length; i++) {
        chr = value.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}
