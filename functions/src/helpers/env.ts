import { AppEnv } from '../types/AppEnv'
import * as functions from 'firebase-functions'
import { MailgunEnv } from '../types/MailgunEnv'

export const getAppEnv = (): AppEnv => {
    const { app } = functions.config()
    if (!app) {
        throw new Error('Missing app environment')
    }
    const { env, url } = app
    if (!env || !url) {
        throw new Error('Missing app env or app url')
    }
    return {
        env,
        url,
    }
}

export const getMailgunEnv = (): MailgunEnv => {
    const { mailgun } = functions.config()
    if (!mailgun) {
        throw new Error('Missing mailgun environment')
    }
    const { key, domain, api } = mailgun
    if (!key || !domain || !api) {
        throw new Error('Missing mailgun key or mailgun domain or mailgun api')
    }
    return {
        key,
        domain,
        api,
    }
}
