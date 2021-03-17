import LanguageDetector from 'i18next-browser-languagedetector'
import enTranslation from './languages/en.root'
import frTranslation from './languages/fr.root'
import i18next from 'i18next'

const i18n = i18next.createInstance()
i18n.use(LanguageDetector).init({
    // we init with resources
    resources: {
        en: {
            translations: enTranslation,
        },
        fr: {
            translations: frTranslation,
        },
    },
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
export default i18n
