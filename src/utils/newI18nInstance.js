import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

export const newI18nInstance = (resources) => {
    const i18n = i18next.createInstance()
    i18n.use(LanguageDetector).init({
        // we init with resources
        resources: resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV !== 'production',

        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',

        interpolation: {
            escapeValue: false, // not needed for react!!
            formatSeparator: ',',
        },
        react: {
            useSuspense: false,
        },
    })
    document.documentElement.lang = i18n.language

    return i18n
}
