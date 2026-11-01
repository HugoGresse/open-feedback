import { isEmpty } from 'lodash'
import type { MailgunEnv } from '../types/MailgunEnv'

export interface EmailData {
    to?: string[]
    cc?: string[]
    bcc?: string[]
    replyTo?: string
    subject: string
    html: string
}

const send = (config: MailgunEnv, data: EmailData): Promise<Response> => {
    if (!config?.key || !config.api || !config.domain) {
        return Promise.reject(
            new Error(
                'Mailgun configuration mailgun.key or mailgun.domain or mailgun.api not found.'
            )
        )
    }
    const { to, cc, bcc, replyTo, subject, html } = data

    if (isEmpty(to) && isEmpty(cc) && isEmpty(bcc)) {
        return Promise.reject(new Error('No recipients given.'))
    }

    const { key, api, domain } = config

    const token = Buffer.from(`api:${key}`).toString('base64')
    const from = `OpenFeedback <no-reply@${domain}>`
    const form = new FormData()
    form.append('from', from)
    form.append('subject', subject)
    form.append('html', html)
    replyTo && form.append('h:Reply-To', replyTo)
    to?.forEach((dest) => {
        if (dest) form.append('to', dest)
    })
    bcc?.forEach((dest) => {
        const bccEmail =
            !isEmpty(dest) && /\S+@\S+\.\S+/.test(dest) ? dest : null
        if (bccEmail) form.append('bcc', bccEmail)
    })
    cc?.forEach((dest) => {
        const ccEmail =
            !isEmpty(dest) && /\S+@\S+\.\S+/.test(dest) ? dest : null
        if (ccEmail) form.append('cc', ccEmail)
    })

    console.info(`Send email "${subject}" to`, { to, cc, bcc })

    return fetch(`${api}`, {
        headers: { Authorization: `Basic ${token}` },
        method: 'POST',
        body: form,
    })
}

export default send
