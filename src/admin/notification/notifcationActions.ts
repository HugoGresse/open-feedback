import type { AppThunk } from '../../store'
import {
    ADD_NOTIFICATION,
    type NotificationAction,
    type NotificationInput,
    SET_CURRENT_NOTIFICATION,
    SET_OPEN_NOTIFICATION,
} from './notificationActionTypes'
import {
    getNotificationsSelector,
    isNotificationOpenSelector,
} from './notificationSelectors'

export type {
    AdminNotification,
    NotificationInput,
    NotificationType,
} from './notificationActionTypes'

export const addNotification =
    (notificationObject: NotificationInput): AppThunk =>
    (dispatch, getState) => {
        dispatch({
            type: ADD_NOTIFICATION,
            payload: {
                ...notificationObject,
                key: new Date().getTime(),
            },
        })

        if (isNotificationOpenSelector(getState())) {
            // immediately begin dismissing current message
            // to start showing new one
            dispatch(setOpenNotification(false))
        } else {
            dispatch(processNotificationQueue())
        }
    }

export const processNotificationQueue =
    (): AppThunk => (dispatch, getState) => {
        const notifications = getNotificationsSelector(getState())
        if (notifications.length > 0) {
            dispatch({
                type: SET_CURRENT_NOTIFICATION,
                payload: notifications[0],
            })

            dispatch(setOpenNotification(true))
        }
    }

export const setOpenNotification = (
    shouldOpen: boolean
): NotificationAction => ({
    type: SET_OPEN_NOTIFICATION,
    payload: shouldOpen,
})
