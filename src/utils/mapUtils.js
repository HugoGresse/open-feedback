export const filterMap = (inputMap, filterFunc) => {
    const newMap = {}

    Object.keys(inputMap).forEach(key => {
        if (filterFunc(inputMap[key], key)) {
            newMap[key] = inputMap[key]
        }
    })

    return newMap
}
