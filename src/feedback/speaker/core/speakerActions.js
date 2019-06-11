import { GET_SPEAKERS_ERROR, GET_SPEAKERS_SUCCESS } from './speakerActionTypes'
import { fireStoreScheduleInstance } from '../../../firebase'
import { getProjectSelector } from '../../project/projectSelectors'

export const getSpeakers = sessionId => {
    return (dispatch, getState) => {
        return fireStoreScheduleInstance
            .collection('speakers')
            .get()
            .then(speakersSnapshot => {
                let speakers = {}

                const websiteLink = getProjectSelector(getState()).websiteLink
                let temp

                speakersSnapshot.forEach(doc => {
                    speakers[doc.id] = doc.data()
                    speakers[doc.id].id = doc.id
                    temp = speakers[doc.id].photoUrl
                    if (temp && !temp.startsWith('http')) {
                        speakers[doc.id].photoUrl = websiteLink + temp
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
