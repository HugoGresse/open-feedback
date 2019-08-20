import { GET_SPEAKERS_ERROR, GET_SPEAKERS_SUCCESS } from './speakerActionTypes'
import { projectApi } from '../../../core/setupType/projectApi'
import { getProjectSelector } from '../../project/projectSelectors'

export const getSpeakers = () => {
    return (dispatch, getState) => {
        return projectApi
            .getSpeakers(getState())
            .then(speakers => {
                const websiteLink = getProjectSelector(getState()).websiteLink
                let photoUrl

                Object.keys(speakers).forEach(speakerId => {
                    photoUrl = speakers[speakerId].photoUrl
                    if (photoUrl && !photoUrl.startsWith('http')) {
                        speakers[speakerId].photoUrl = websiteLink + photoUrl
                    }
                })

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
