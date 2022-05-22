import { AppEnv } from '../types/AppEnv'
import { MailgunEnv } from '../types/MailgunEnv'
import { OpsGenieEnv } from '../types/OpsGenieEnv'

export const getAppEnv = (): AppEnv => {
    const appEnv = process.env.APP_ENV
    const appUrl = process.env.APP_URL
    const contactEmail = process.env.APP_CONTACTEMAIL
    const recaptchaSecret = process.env.APP_RECAPTCHAV3SECRET

    if (!appEnv) {
        throw new Error('APP_ENV is not defined in environment variables')
    }
    if (!appUrl) {
        throw new Error('APP_URL is not defined in environment variables')
    }
    return {
        env: appEnv,
        url: appUrl,
        contactEmail: contactEmail,
        recaptchaV3Secret: recaptchaSecret,
    }
}

export const getMailgunEnv = (): MailgunEnv => {
    const mailgunDomain = process.env.MAILGUN_DOMAIN
    const mailgunKey = process.env.MAILGUN_KEY
    const mailgunApi = process.env.MAILGUN_API
    if (!mailgunDomain) {
        throw new Error(
            'MAILGUN_DOMAIN is not defined in environment variables'
        )
    }
    if (!mailgunKey) {
        throw new Error('MAILGUN_KEY is not defined in environment variables')
    }
    if (!mailgunApi) {
        throw new Error('MAILGUN_API is not defined in environment variables')
    }

    return {
        key: mailgunKey,
        domain: mailgunDomain,
        api: mailgunApi,
    }
}

export const getOpsGenieEnv = (): OpsGenieEnv | null => {
    const opsGenieKey = process.env.OPSGENIE_KEY
    const opsGenieApi = process.env.OPSGENIE_API

    if (!opsGenieKey || !opsGenieApi) {
        return null
    }

    return {
        key: opsGenieKey,
        api: opsGenieApi,
    }
}
