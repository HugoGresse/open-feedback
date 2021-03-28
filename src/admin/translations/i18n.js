import enTranslation from './languages/en.admin'
import frTranslation from './languages/fr.admin'
import { newI18nInstance } from '../../utils/newI18nInstance'

const i18n = newI18nInstance({
    en: {
        translations: enTranslation,
    },
    fr: {
        translations: frTranslation,
    },
})

export default i18n
