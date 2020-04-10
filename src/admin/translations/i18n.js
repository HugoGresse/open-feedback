import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enTranslation from './languages/en.admin'
import frTranslation from './languages/fr.admin'

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
    debug: false,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    interpolation: {
        escapeValue: false, // not needed for react!!
        formatSeparator: ',',
    },

    react: {
        wait: true,
    },
})

export default i18n
