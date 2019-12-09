import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION,
} from './notificationActionTypes'

export const addNotification = notificationObject => ({
    type: ADD_NOTIFICATION,
    payload: notificationObject,
})

export const clearNotification = notificationObject => {
    return dispatch => {
        dispatch({
            type: REMOVE_NOTIFICATION,
            payload: notificationObject,
        })
    }
}
