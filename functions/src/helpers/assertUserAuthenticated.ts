import { CallableRequest, HttpsError } from 'firebase-functions/v2/https'

export const assertUserAuthenticated = (request: CallableRequest): string => {
    if (!(request.auth && request.auth.token)) {
        throw new HttpsError('unauthenticated', 'User not authentificated.')
    }
    return request.auth.uid
}
