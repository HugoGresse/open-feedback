import {isEmpty} from "lodash"
import FormData from "form-data"
import fetch, {Response} from "node-fetch"

interface MailgunConfig {
    key: string,
    domain: string,
    api: string
}

interface EmailData {
    to?: string[],
    cc?: string[],
    bcc?: string[],
    subject: string,
    html: string
}

const send = (config: MailgunConfig, data: EmailData): Promise<Error | Response> => {
    if (!config || !config.key || !config.api) {
        return Promise.reject(new Error('Mailgun configuration mailgun.key or mailgun.domain not found.'))
    }
    const {to, cc, bcc, subject, html} = data

    if (isEmpty(to) && isEmpty(cc) && isEmpty(bcc)) {
        return Promise.reject(new Error('No recipients given.'))
    }

    const {key, api, domain} = config

    // eslint-disable-next-line no-undef
    const token = Buffer.from(`api:${key}`).toString('base64')
    const from = `OpenFeedback <no-reply@${domain}>`
    const form = new FormData()
    form.append('from', from)
    form.append('subject', subject)
    form.append('html', html)
    to && to.forEach((dest) => {
        if (dest) form.append('to', dest)
    })
    bcc && bcc.forEach((dest) => {
        const bccEmail = !isEmpty(dest) && /\S+@\S+\.\S+/.test(dest) ? dest : null
        if (bccEmail) form.append('bcc', bccEmail)
    })
    cc && cc.forEach((dest) => {
        const ccEmail = !isEmpty(dest) && /\S+@\S+\.\S+/.test(dest) ? dest : null
        if (ccEmail) form.append('cc', ccEmail)
    })

    // eslint-disable-next-line no-console
    console.info(`Send email "${subject}" to`, {to, cc, bcc})

    return fetch(`${api}`, {
        headers: {Authorization: `Basic ${token}`},
        method: 'POST',
        body: form,
    })
}

export default send
