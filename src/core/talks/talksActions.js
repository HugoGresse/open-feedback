import {
    GET_TALKS_ERROR,
    GET_TALKS_LOADING,
    GET_TALKS_SUCCESS,
    SET_TALKS_FILTER,
    ADD_TALK_ERROR,
    ADD_TALK_SUCCESS,
    EDIT_TALK_ERROR,
    EDIT_TALK_SUCCESS,
    REMOVE_TALK_ERROR,
    REMOVE_TALK_SUCCESS,
} from './talksActionTypes'
import { projectApi } from '../setupType/projectApi'
import { ADD_NOTIFICATION } from '../../admin/notification/notificationActionTypes'

export const getTalks = () => {
    return dispatch => {
        dispatch({
            type: GET_TALKS_LOADING,
        })

        return projectApi
            .getTalks()
            .then(talksWithSchedule => {
                dispatch({
                    type: GET_TALKS_SUCCESS,
                    payload: talksWithSchedule,
                })
                return talksWithSchedule
            })
            .catch(err => {
                dispatch({
                    type: GET_TALKS_ERROR,
                    payload: err.toString(),
                })
            })
    }
}

export const setTalksFilter = filter => {
    return dispatch => {
        dispatch({
            type: SET_TALKS_FILTER,
            payload: filter,
        })
    }
}

export const addTalk = talk => dispatch => {
    return projectApi
        .addTalk(talk)
        .then(id => {
            dispatch({
                type: ADD_TALK_SUCCESS,
                payload: {
                    ...talk,
                    id,
                },
            })
        })
        .catch(error => {
            dispatch({
                type: ADD_TALK_ERROR,
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

export const editTalk = talk => dispatch => {
    return projectApi
        .editTalk(talk)
        .then(() => {
            dispatch({
                type: EDIT_TALK_SUCCESS,
                payload: talk,
            })
        })
        .catch(error => {
            dispatch({
                type: EDIT_TALK_ERROR,
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

export const removeTalk = talk => dispatch => {
    return projectApi
        .removeTalk(talk.id)
        .then(() => {
            dispatch({
                type: REMOVE_TALK_SUCCESS,
                payload: talk,
            })
        })
        .catch(error => {
            dispatch({
                type: REMOVE_TALK_ERROR,
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
