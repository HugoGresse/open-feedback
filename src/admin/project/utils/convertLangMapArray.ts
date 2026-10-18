import LangMap from 'langmap'

export const langMapArray = Object.keys(LangMap).reduce((acc, tag) => {
    acc.push({
        ...LangMap[tag],
        tag,
    })
    return acc
}, [])
