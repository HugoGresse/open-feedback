import { GET_SPEAKERS_SUCCESS, GET_SPEAKERS_ERROR } from './speakerActionTypes'
import { fireStoreScheduleInstance } from '../../../firebase'

export const getSpeakers = sessionId => {
    return (dispatch, getState) => {
        return fireStoreScheduleInstance
            .collection('speakers')
            .get()
            .then(speakersSnapshot => {
                let speakers = {}
                speakersSnapshot.forEach(doc => {
                    speakers[doc.id] = doc.data()
                    speakers[doc.id].id = doc.id
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
