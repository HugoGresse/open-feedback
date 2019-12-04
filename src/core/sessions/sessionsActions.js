import {
    GET_SESSIONS_ERROR,
    GET_SESSIONS_LOADING,
    GET_SESSIONS_SUCCESS,
    SET_SESSIONS_FILTER,
    ADD_SESSION_ERROR,
    ADD_SESSION_SUCCESS,
    EDIT_SESSION_ERROR,
    EDIT_SESSION_SUCCESS,
    REMOVE_SESSION_ERROR,
    REMOVE_SESSION_SUCCESS,
} from './sessionsActionTypes'
import { projectApi } from '../setupType/projectApi'
import { ADD_NOTIFICATION } from '../../admin/notification/notificationActionTypes'

export const getTalks = () => {
    return dispatch => {
        dispatch({
            type: GET_SESSIONS_LOADING,
        })

        projectApi
            .getSessions()
            .then(sessionsWithSchedule => {
                dispatch({
                    type: GET_SESSIONS_SUCCESS,
                    payload: sessionsWithSchedule,
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_SESSIONS_ERROR,
                    payload: err.toString(),
                })
            })
    }
}

export const setTalksFilter = filter => {
    return dispatch => {
        dispatch({
            type: SET_SESSIONS_FILTER,
            payload: filter,
        })
    }
}

export const addTalk = session => dispatch => {
    return projectApi
        .addSession(session)
        .then(id => {
            dispatch({
                type: ADD_SESSION_SUCCESS,
                payload: {
                    ...session,
                    id,
                },
            })
        })
        .catch(error => {
            dispatch({
                type: ADD_SESSION_ERROR,
                payload: {
                    error: error,
                },
            })
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: `Failed to add talk, ${error}`,
                },
            })
        })
}

export const editTalk = session => dispatch => {
    return projectApi
        .editSession(session)
        .then(() => {
            dispatch({
                type: EDIT_SESSION_SUCCESS,
                payload: session,
            })
        })
        .catch(error => {
            dispatch({
                type: EDIT_SESSION_ERROR,
                payload: {
                    error: error,
                },
            })
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: `Failed to edit talk, ${error}`,
                },
            })
        })
}

export const removeTalk = session => dispatch => {
    return projectApi
        .removeSession(session.id)
        .then(() => {
            dispatch({
                type: REMOVE_SESSION_SUCCESS,
                payload: session,
            })
        })
        .catch(error => {
            dispatch({
                type: REMOVE_SESSION_ERROR,
                payload: {
                    error: error,
                },
            })
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: `Failed to remove talk, ${error}`,
                },
            })
        })
}
