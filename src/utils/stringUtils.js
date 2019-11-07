export const normalizeAndRemoveDiacritics = (value) => {
    if (!value) {
        return value
    }
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export const newId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let autoId = ''
    for (let i = 0; i < 20; i++) {
        autoId += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return autoId
}
