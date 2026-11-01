import * as functions from 'firebase-functions'
import { escape as escapeHtml } from 'lodash'
import { getAppEnv, getMailgunEnv } from '../helpers/env'
import send from '../email/send'

interface ContactRequest {
    email: string
    message: string
    recaptchaV3Response: string
}

// One address, no whitespace or control characters (header injection) nor
// characters that would make Reply-To a list or a display name.
const EMAIL_REGEX =
    /^[^\s\p{C}@<>(),;:"]+@[^\s\p{C}@<>(),;:"]+\.[^\s\p{C}@<>(),;:".]+$/u
const EMAIL_MAX_LENGTH = 254
const MESSAGE_MAX_LENGTH = 10000

const isValidReplyToEmail = (email: unknown): email is string =>
    typeof email === 'string' &&
    email.length <= EMAIL_MAX_LENGTH &&
    EMAIL_REGEX.test(email)

/** Returns the contact form fields, or an error message for invalid input. */
export const parseContactRequest = (
    rawBody: unknown
): ContactRequest | { error: string } => {
    // Bodies with an unknown content type arrive as a Buffer
    let body = Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : rawBody
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body)
        } catch {
            return { error: 'Invalid JSON body' }
        }
    }
    if (typeof body !== 'object' || body === null) {
        return { error: 'Invalid body' }
    }
    const { email, message, recaptchaV3Response } = body as Record<
        string,
        unknown
    >
    if (!isValidReplyToEmail(email)) {
        return { error: 'Invalid email' }
    }
    if (typeof message !== 'string' || message.trim() === '') {
        return { error: 'Missing message' }
    }
    if (message.length > MESSAGE_MAX_LENGTH) {
        return { error: 'Message too long' }
    }
    if (typeof recaptchaV3Response !== 'string') {
        return { error: 'Missing captcha' }
    }
    return { email, message, recaptchaV3Response }
}

const contactEmailHtml = (email: string, message: string): string =>
    `<html><body><p>${escapeHtml(message).replace(/\r?\n/g, '<br/>')}</p><br/>From: ${escapeHtml(email)}</body></html>`

export const sendContactEmail = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    if (req.method !== 'POST') {
        res.status(200).send()
        return
    }

    const reply = (
        status: number,
        body: { success: boolean; error?: string }
    ) => res.status(status).json(body)

    const contactRequest = parseContactRequest(req.body)
    if ('error' in contactRequest) {
        console.info('> sendContactEmail invalid input', contactRequest.error)
        reply(400, { success: false, error: contactRequest.error })
        return
    }

    try {
        const isCaptchaValid = await isRecaptchaV3Valid(
            contactRequest.recaptchaV3Response
        )

        if (!isCaptchaValid) {
            console.info('> sendContactEmail invalid captcha')
            reply(403, { success: false, error: 'Captcha not valid' })
            return
        }

        const appEnv = getAppEnv()
        const mailgunEnv = getMailgunEnv()
        if (!appEnv.contactEmail) {
            throw new Error('Missing app.contactEmail env')
        }

        const sendResult = await send(mailgunEnv, {
            to: [appEnv.contactEmail],
            subject: `[OpenFeedback contact] ${Date.now()}`,
            replyTo: contactRequest.email,
            html: contactEmailHtml(
                contactRequest.email,
                contactRequest.message
            ),
        })
        if (sendResult.ok) {
            reply(200, { success: true })
        } else {
            console.error(
                '> sendContactEmail Mailgun error',
                sendResult.status,
                await sendResult.text()
            )
            reply(500, {
                success: false,
                error: `Failed to send email: ${sendResult.statusText}`,
            })
        }
    } catch (error) {
        console.error('> sendContactEmail failed', error)
        reply(500, { success: false, error: 'Failed to send email' })
    }
})

const isRecaptchaV3Valid = async (recaptchaV3Value: string) => {
    const appEnv = getAppEnv()
    if (!appEnv.recaptchaV3Secret) {
        throw new Error('Missing recaptchaV3Secret secret')
    }
    return fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: new URLSearchParams({
            secret: appEnv.recaptchaV3Secret,
            response: recaptchaV3Value,
        }),
    })
        .then((response: Response) => response.json())
        .then((response: { success: boolean; score: number }) => {
            return response.success && response.score > 0.5
        })
        .catch((error: Error) => {
            console.error(error)
            return false
        })
}
