import { GET_SPEAKERS_ERROR, GET_SPEAKERS_SUCCESS } from './speakerActionTypes'
import { projectApi } from '../setupType/projectApi'

export const getSpeakers = () => {
    return (dispatch, getState) => {
        return projectApi
            .getSpeakers(getState())
            .then(speakers => {
                dispatch({
                    type: GET_SPEAKERS_SUCCESS,
                    payload: speakers
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_SPEAKERS_ERROR,
                    payload: err
                })
            })
    }
}
