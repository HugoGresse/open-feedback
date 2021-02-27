import { CallableContext } from 'firebase-functions/lib/providers/https'
import * as functions from 'firebase-functions'

export const assertUserAuthenticated = (context: CallableContext): string => {
    if (!(context.auth && context.auth.token)) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User not authentificated.'
        )
    }
    return context.auth.uid
}
