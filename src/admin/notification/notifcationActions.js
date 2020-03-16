import {
    ADD_NOTIFICATION,
    SET_CURRENT_NOTIFICATION,
    SET_OPEN_NOTIFICATION,
} from './notificationActionTypes'
import {
    getNotificationsSelector,
    isNotificationOpenSelector,
} from './notificationSelectors'

export const addNotification = notificationObject => (dispatch, getState) => {
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

export const processNotificationQueue = () => (dispatch, getState) => {
    const notifications = getNotificationsSelector(getState())
    if (notifications.length > 0) {
        dispatch({
            type: SET_CURRENT_NOTIFICATION,
            payload: notifications[0],
        })

        dispatch(setOpenNotification(true))
    }
}

export const setOpenNotification = shouldOpen => ({
    type: SET_OPEN_NOTIFICATION,
    payload: shouldOpen,
})
