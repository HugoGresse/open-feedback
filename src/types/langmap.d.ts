declare module 'langmap' {
    export interface LanguageMapping {
        nativeName: string
        englishName: string
    }

    const languageMappingList: Record<string, LanguageMapping>
    export default languageMappingList
}
