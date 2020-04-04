import { analytics } from '../../firebase'

export const trackUserId = userId => {
    analytics.setUserId(userId)
}

export const trackLogin = isAnonymous => {
    analytics.logEvent('login', {
        method: isAnonymous ? 'anonymous' : 'account',
    })
}

export const trackSignIn = isAnonymous => {
    analytics.logEvent('sign_up', {
        method: isAnonymous ? 'anonymous' : 'account',
    })
}
