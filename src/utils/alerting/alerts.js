import { hashString } from '../stringUtils'

export const ALERT_FIREBASE_QUOTA_REACHED = {
    message: 'Firebase Authentification Quota Reached',
    alias: 'firebase-authentification-quota-reached',
    description:
        'Authentification quota has been reached, user no longer can vote or create accounts',
    tags: ['OverwriteQuietHours', 'Critical', 'firebase'],
    priority: 'P1',
}

export const ALERT_REACT_CATCHED_ERROR_ADMIN = (error, stack) => ({
    message: 'React error catched',
    alias:
        'react-error-catch-' +
        hashString(String(error) + JSON.stringify(stack) + window.origin),
    description: 'An error occurred in javascript catched by React DidCatch.',
    details: {
        error: String(error),
        stack: JSON.stringify(stack),
        origin: window.origin,
    },
    tags: ['react'],
    priority: 'P5',
})

export const ALERT_REACT_CATCHED_ERROR_FEEDBACK = (error, stack) => ({
    message: 'Feedback App: React error catched',
    alias:
        'feedback-react-error-catch-' +
        hashString(String(error) + JSON.stringify(stack) + window.origin),
    description: 'An error occurred in javascript catched by React DidCatch.',
    details: {
        error: String(error),
        stack: JSON.stringify(stack),
        origin: window.origin,
    },
    tags: ['react'],
    priority: 'P2',
})

export const ALERT_REACT_CATCHED_ERROR_LANDING = (error, stack) => ({
    message: 'Root/Landing App: React error catched',
    alias:
        'landing-react-error-catch-' +
        hashString(String(error) + JSON.stringify(stack) + window.origin),
    description: 'An error occurred in javascript catched by React DidCatch.',
    details: {
        error: String(error),
        stack: JSON.stringify(stack),
        origin: window.origin,
    },
    tags: ['react'],
    priority: 'P2',
})
