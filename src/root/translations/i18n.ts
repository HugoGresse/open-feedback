import enTranslation from './languages/en.root.json'
import frTranslation from './languages/fr.root.json'
import { newI18nInstance } from '../../utils/newI18nInstance'

export const i18n = newI18nInstance({
    en: {
        translations: enTranslation,
    },
    fr: {
        translations: frTranslation,
    },
})
