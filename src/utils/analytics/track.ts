import { analytics } from '../../firebase.ts'

export const trackUserId = (userId: string) => {
    if (!analytics) return
    analytics.setUserId(userId)
}

export const trackLogin = (isAnonymous: boolean) => {
    if (!analytics) return
    analytics.logEvent('login', {
        method: isAnonymous ? 'anonymous' : 'account',
    })
}

export const trackSignIn = (isAnonymous: boolean) => {
    if (!analytics) return
    analytics.logEvent('sign_up', {
        method: isAnonymous ? 'anonymous' : 'account',
    })
}
