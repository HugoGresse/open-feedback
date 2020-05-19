import * as functions from 'firebase-functions'
import fetch from 'node-fetch'
import { isEmpty } from 'lodash'

export const alert = functions.https.onCall((data) => {
    const { opsgenie } = functions.config()

    if (isEmpty(data)) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Input parameters are empty'
        )
    }

    if (isEmpty(opsgenie)) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Missing credentials for opsgenie'
        )
    }

    const { api, key } = opsgenie

    if (isEmpty(api)) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Missing  api url for opsgenie'
        )
    }
    if (isEmpty(key)) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Missing key for opsgenie'
        )
    }

    return fetch(`${api}/v2/alerts`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `GenieKey ${key}`,
        },
        body: JSON.stringify(data),
    }).then((response) => {
        if (response.ok) {
            return response.text()
        } else {
            console.error(
                'failed to send alert',
                response.status,
                response.statusText
            )
            return `${response.status}: ${response.statusText}`
        }
    })
})
