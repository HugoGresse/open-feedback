import LangMap from 'langmap'

const langMapArray = Object.keys(LangMap).reduce((acc, tag) => {
    acc.push({
        ...LangMap[tag],
        tag,
    })
    return acc
}, [])

export default langMapArray
