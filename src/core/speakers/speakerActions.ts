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
    type SpeakersAction,
} from './speakerActionTypes'
import { projectApi } from '../setupType/projectApi'
import { addNotification } from '../../admin/notification/notifcationActions'
import type { AppThunk } from '../../store'
import type { NewSpeaker, Speaker } from '../models'

// Read-only project APIs have no write methods: the admin UI only offers
// edition when projectApi.isReadOnly() is false.

export const getSpeakers = (): AppThunk<Promise<void>> => (dispatch) => {
    return projectApi
        .getSpeakers()
        .then((speakers) => {
            dispatch({
                type: GET_SPEAKERS_SUCCESS,
                payload: speakers,
            })
        })
        .catch((err) => {
            dispatch({
                type: GET_SPEAKERS_ERROR,
                payload: err,
            })
        })
}

export const filterSpeakers =
    (filter: string): AppThunk<SpeakersAction> =>
    (dispatch) => {
        return dispatch({
            type: FILTER_SPEAKER,
            payload: filter,
        })
    }

export const addSpeaker =
    (speaker: NewSpeaker): AppThunk<Promise<Speaker | undefined>> =>
    (dispatch) => {
        return projectApi.addSpeaker!(speaker)
            .then((id) => {
                const newSpeaker = {
                    ...speaker,
                    id,
                }
                dispatch({
                    type: ADD_SPEAKER_SUCCESS,
                    payload: newSpeaker,
                })
                return newSpeaker
            })
            .catch((error) => {
                dispatch({
                    type: ADD_SPEAKER_ERROR,
                    payload: {
                        error: error,
                    },
                })
                dispatch(
                    addNotification({
                        type: 'error',
                        message: `Failed to add speaker, ${error}`,
                    })
                )
                return undefined
            })
    }

export const editSpeaker =
    (speaker: Speaker): AppThunk<Promise<void>> =>
    (dispatch) => {
        return projectApi.editSpeaker!(speaker)
            .then(() => {
                dispatch({
                    type: EDIT_SPEAKER_SUCCESS,
                    payload: speaker,
                })
            })
            .catch((error) => {
                dispatch({
                    type: EDIT_SPEAKER_ERROR,
                    payload: {
                        error: error,
                    },
                })
                dispatch(
                    addNotification({
                        type: 'error',
                        message: `Failed to edit speaker, ${error}`,
                    })
                )
            })
    }

export const removeSpeaker =
    (speaker: Speaker): AppThunk<Promise<void>> =>
    (dispatch) => {
        return projectApi.removeSpeaker!(speaker.id)
            .then(() => {
                dispatch({
                    type: REMOVE_SPEAKER_SUCCESS,
                    payload: speaker,
                })
            })
            .catch((error) => {
                dispatch({
                    type: REMOVE_SPEAKER_ERROR,
                    payload: {
                        error: error,
                    },
                })
                dispatch(
                    addNotification({
                        type: 'error',
                        message: `Failed to remove speaker, ${error}`,
                    })
                )
            })
    }
