import enTranslation from './languages/en.feedback.json'
import frTranslation from './languages/fr.feedback.json'
import { newI18nInstance } from '../../utils/newI18nInstance'

export const i18n = newI18nInstance({
    en: {
        translations: enTranslation,
    },
    fr: {
        translations: frTranslation,
    },
})
