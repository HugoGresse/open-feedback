import type { MailgunEnv } from '../types/MailgunEnv'
import { isValidEmailAddress } from './isValidEmailAddress'

export interface EmailData {
    to: string[]
    replyTo?: string
    subject: string
    html: string
}

const send = async (config: MailgunEnv, data: EmailData): Promise<Response> => {
    if (!config?.key || !config.api || !config.domain) {
        throw new Error(
            'Mailgun configuration mailgun.key or mailgun.domain or mailgun.api not found.'
        )
    }
    const { to, html } = data

    if (!Array.isArray(to) || to.length === 0) {
        throw new Error('No recipients given.')
    }
    // `for` rather than `find`: an undefined entry is invalid too
    for (const address of to) {
        if (!isValidEmailAddress(address)) {
            throw new Error('Invalid recipient email address.')
        }
    }
    // Reply-To is optional: a bad one is dropped, the email still goes out
    const replyTo = isValidEmailAddress(data.replyTo) ? data.replyTo : null
    if (data.replyTo && !replyTo) {
        console.warn('Send email: invalid Reply-To dropped')
    }
    // Keep the subject header on one line
    const subject = String(data.subject).replace(/[\p{Cc}\p{Zl}\p{Zp}]+/gu, ' ')

    const { key, api, domain } = config

    const token = Buffer.from(`api:${key}`).toString('base64')
    const from = `OpenFeedback <no-reply@${domain}>`
    const form = new FormData()
    form.append('from', from)
    form.append('subject', subject)
    form.append('html', html)
    if (replyTo) form.append('h:Reply-To', replyTo)
    for (const address of to) form.append('to', address)

    console.info('Send email', { subject, to })

    return fetch(`${api}`, {
        headers: { Authorization: `Basic ${token}` },
        method: 'POST',
        body: form,
    })
}

export default send
