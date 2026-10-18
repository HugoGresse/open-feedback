import LangMap, { type LanguageMapping } from 'langmap'

export interface LanguageMappingWithTag extends LanguageMapping {
    tag: string
}

export const langMapArray = Object.keys(LangMap).reduce<
    LanguageMappingWithTag[]
>((acc, tag) => {
    acc.push({
        ...LangMap[tag],
        tag,
    })
    return acc
}, [])
