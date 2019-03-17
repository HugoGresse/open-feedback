import {
    ADD_NOTIFICATION,
    ADD_PROJECT_ERROR,
    ADD_PROJECT_SUCCESS,
    EDIT_PROJECT_ERROR,
    EDIT_PROJECT_SUCCESS,
    GET_PROJECTS_ERROR,
    GET_PROJECTS_SUCCESS,
    REMOVE_NOTIFICATION,
    SELECT_PROJECT,
    UNSELECT_PROJECT
} from './notificationActionTypes'
import { getSelectedProjectIdSelector } from './notificationSelectors'

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
