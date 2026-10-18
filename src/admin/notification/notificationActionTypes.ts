export const ADD_NOTIFICATION = 'admin/notification/add'
export const SET_CURRENT_NOTIFICATION = 'admin/notification/setCurrent'
export const SET_OPEN_NOTIFICATION = 'admin/notification/open'

/**
 * Snackbar variant. Only these two have an icon in Notifications.tsx.
 */
export type NotificationType = 'success' | 'error'

/**
 * What callers pass to addNotification(). When i18nkey is set, the message is
 * appended to the translated text.
 */
export interface NotificationInput {
    type: NotificationType
    message?: string
    i18nkey?: string
}

/**
 * A queued notification: the input plus a unique key (creation timestamp).
 */
export interface AdminNotification extends NotificationInput {
    key: number
}

export type NotificationAction =
    | { type: typeof ADD_NOTIFICATION; payload: AdminNotification }
    | { type: typeof SET_CURRENT_NOTIFICATION; payload: AdminNotification }
    | { type: typeof SET_OPEN_NOTIFICATION; payload: boolean }
