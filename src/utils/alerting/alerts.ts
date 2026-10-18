import { hashString } from '../stringUtils'

/** Payload of the `alert` callable function (forwarded to OpsGenie). */
export interface Alert {
    message: string
    alias: string
    description: string
    details?: Record<string, unknown>
    tags: string[]
    priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5'
}

export type ErrorAlertFactory = (error: unknown, stack: unknown) => Alert

export const ALERT_FIREBASE_QUOTA_REACHED: Alert = {
    message: 'Firebase Authentification Quota Reached',
    alias: 'firebase-authentification-quota-reached',
    description:
        'Authentification quota has been reached, user no longer can vote or create accounts',
    tags: ['OverwriteQuietHours', 'Critical', 'firebase'],
    priority: 'P1',
}

export const ALERT_REACT_CATCHED_ERROR_ADMIN: ErrorAlertFactory = (
    error,
    stack
) => ({
    message: 'React error catched',
    alias:
        'react-error-catch-' +
        hashString(
            String(error) + JSON.stringify(stack) + window.location.href
        ),
    description: 'An error occurred in javascript catched by React DidCatch.',
    details: {
        error: String(error),
        stack: JSON.stringify(stack),
        origin: window.origin,
        location: window.location,
    },
    tags: ['react'],
    priority: 'P5',
})

export const ALERT_REACT_CATCHED_ERROR_FEEDBACK: ErrorAlertFactory = (
    error,
    stack
) => ({
    message: 'Feedback App: React error catched',
    alias:
        'feedback-react-error-catch-' +
        hashString(
            String(error) + JSON.stringify(stack) + window.location.href
        ),
    description: 'An error occurred in javascript catched by React DidCatch.',
    details: {
        error: String(error),
        stack: JSON.stringify(stack),
        origin: window.origin,
        location: window.location,
    },
    tags: ['react'],
    priority: 'P2',
})

export const ALERT_REACT_CATCHED_ERROR_LANDING: ErrorAlertFactory = (
    error,
    stack
) => ({
    message: 'Root/Landing App: React error catched',
    alias:
        'landing-react-error-catch-' +
        hashString(
            String(error) + JSON.stringify(stack) + window.location.href
        ),
    description: 'An error occurred in javascript catched by React DidCatch.',
    details: {
        error: String(error),
        stack: JSON.stringify(stack),
        origin: window.origin,
        location: window.location,
    },
    tags: ['react'],
    priority: 'P2',
})
