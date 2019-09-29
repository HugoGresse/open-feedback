export const normalizeAndRemoveDiacritics = (value ) => {
    if(!value) {
        return value
    }
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}
