export const filterMap = (inputMap, filterFunc) => {
    const newMap = {}

    Object.keys(inputMap).forEach(key => {
        if (filterFunc(inputMap[key], key)) {
            newMap[key] = inputMap[key]
        }
    })

    return newMap
}

export const isEmptyMap = map => map && Object.keys(map).length === 0
