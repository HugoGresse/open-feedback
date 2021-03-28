import enTranslation from './languages/en.root'
import frTranslation from './languages/fr.root'
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
