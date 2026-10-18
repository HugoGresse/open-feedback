export const filterMap = <T>(
    inputMap: Record<string, T>,
    filterFunc: (value: T, key: string) => unknown
): Record<string, T> => {
    const newMap: Record<string, T> = {}

    Object.keys(inputMap).forEach((key) => {
        if (filterFunc(inputMap[key], key)) {
            newMap[key] = inputMap[key]
        }
    })

    return newMap
}

export const isEmptyMap = (map: object | null | undefined) =>
    map && Object.keys(map).length === 0
