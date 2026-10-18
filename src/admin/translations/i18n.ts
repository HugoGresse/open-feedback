import enTranslation from './languages/en.admin.json'
import frTranslation from './languages/fr.admin.json'
import { newI18nInstance } from '../../utils/newI18nInstance'

export const i18n = newI18nInstance({
    en: {
        translations: enTranslation,
    },
    fr: {
        translations: frTranslation,
    },
})
