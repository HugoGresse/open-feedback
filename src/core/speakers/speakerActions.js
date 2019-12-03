import {
    ADD_SPEAKER_ERROR,
    ADD_SPEAKER_SUCCESS,
    EDIT_SPEAKER_ERROR,
    EDIT_SPEAKER_SUCCESS,
    FILTER_SPEAKER,
    GET_SPEAKERS_ERROR,
    GET_SPEAKERS_SUCCESS,
    REMOVE_SPEAKER_ERROR,
    REMOVE_SPEAKER_SUCCESS,
} from './speakerActionTypes'
import { projectApi } from '../setupType/projectApi'
import { ADD_NOTIFICATION } from '../../admin/notification/notificationActionTypes'

export const getSpeakers = () => dispatch => {
    return projectApi
        .getSpeakers()
        .then(speakers => {
            dispatch({
                type: GET_SPEAKERS_SUCCESS,
                payload: speakers,
            })
        })
        .catch(err => {
            dispatch({
                type: GET_SPEAKERS_ERROR,
                payload: err,
            })
        })
}

export const filterSpeakers = filter => dispatch => {
    return dispatch({
        type: FILTER_SPEAKER,
        payload: filter,
    })
}

export const addSpeaker = speaker => dispatch => {
    return projectApi
        .addSpeaker(speaker)
        .then(id => {
            dispatch({
                type: ADD_SPEAKER_SUCCESS,
                payload: {
                    ...speaker,
                    id,
                },
            })
        })
        .catch(error => {
            dispatch({
                type: ADD_SPEAKER_ERROR,
                payload: {
                    error: error,
                },
            })
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: `Failed to add speaker, ${error}`,
                },
            })
        })
}

export const editSpeaker = speaker => dispatch => {
    return projectApi
        .editSpeaker(speaker)
        .then(() => {
            dispatch({
                type: EDIT_SPEAKER_SUCCESS,
                payload: speaker,
            })
        })
        .catch(error => {
            dispatch({
                type: EDIT_SPEAKER_ERROR,
                payload: {
                    error: error,
                },
            })
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: `Failed to edit speaker, ${error}`,
                },
            })
        })
}

export const removeSpeaker = speaker => dispatch => {
    return projectApi
        .removeSpeaker(speaker.id)
        .then(() => {
            dispatch({
                type: REMOVE_SPEAKER_SUCCESS,
                payload: speaker,
            })
        })
        .catch(error => {
            dispatch({
                type: REMOVE_SPEAKER_ERROR,
                payload: {
                    error: error,
                },
            })
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: `Failed to remove speaker, ${error}`,
                },
            })
        })
}
