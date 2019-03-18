import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION
} from './notificationActionTypes'

export const clearNotification = notificationObject => {
    return (dispatch, getState) => {
        dispatch({
            type: REMOVE_NOTIFICATION,
            payload: notificationObject
        })
    }
}

export const addNotification = notificationObject => (dispatch, getState) => {
    return (dispatch, getState) => {
        dispatch({
            type: ADD_NOTIFICATION,
            payload: notificationObject
        })
    }
}
