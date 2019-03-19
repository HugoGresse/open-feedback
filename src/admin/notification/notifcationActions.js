import { REMOVE_NOTIFICATION } from './notificationActionTypes'

export const clearNotification = notificationObject => {
    return dispatch => {
        dispatch({
            type: REMOVE_NOTIFICATION,
            payload: notificationObject
        })
    }
}
