import { logEvent, setUserId } from 'firebase/analytics'
import { analytics } from '../../firebase.ts'

export const trackUserId = (userId: string) => {
    if (!analytics) return
    setUserId(analytics, userId)
}

export const trackLogin = (isAnonymous: boolean) => {
    if (!analytics) return
    logEvent(analytics, 'login', {
        method: isAnonymous ? 'anonymous' : 'account',
    })
}

export const trackSignIn = (isAnonymous: boolean) => {
    if (!analytics) return
    logEvent(analytics, 'sign_up', {
        method: isAnonymous ? 'anonymous' : 'account',
    })
}
