import * as functions from 'firebase-functions'
import { CallableContext } from 'firebase-functions/lib/common/providers/https'

export const assertUserAuthenticated = (context: CallableContext): string => {
    if (!(context.auth && context.auth.token)) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User not authentificated.'
        )
    }
    return context.auth.uid
}
