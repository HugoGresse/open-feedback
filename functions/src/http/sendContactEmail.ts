import * as functions from 'firebase-functions'
import { getAppEnv, getMailgunEnv } from '../helpers/env'
import fetch, { Response } from 'node-fetch'
import send from '../email/send'

export const sendContactEmail = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.set('Access-Control-Allow-Origin', '*')
        res.status(200).send()
        return
    }

    const body = JSON.parse(req.body)
    const isCaptchaValid = await isRecaptchaV3Valid(body.recaptchaV3Response)

    if (!isCaptchaValid) {
        console.info('> sendContactEmail invalid captcha')
        res.status(503).send('Captcha not valid')
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
        replyTo: body.email,
        html: `<html><body><p>${body.message}</p><br/>From: ${body.email}</body></html>`,
    })
    if (sendResult instanceof Response && sendResult.ok) {
        res.set('Access-Control-Allow-Origin', '*')
        res.status(200).send(
            JSON.stringify({
                success: true,
            })
        )
    } else {
        res.set('Access-Control-Allow-Origin', '*')
        res.status(500).send(
            JSON.stringify({
                success: true,
                error:
                    'Failed to send email: ' + (sendResult as any).statusText,
            })
        )
    }
})

const isRecaptchaV3Valid = async (recaptchaV3Value: string) => {
    const appEnv = getAppEnv()
    if (!appEnv.recaptchaV3Secret) {
        throw new Error('Missing recaptchaV3Secret secret')
    }
    return fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${appEnv.recaptchaV3Secret}&response=${recaptchaV3Value}`
    )
        .then((response) => response.json())
        .then((response) => {
            return response.success && response.score > 0.5
        })
        .catch((error) => {
            console.error(error)
            return false
        })
}
