import {
    GET_SPEAKERS_SUCCESS,
    GET_SPEAKERS_ERROR
} from "./speakerActionTypes"

export const getSpeakers = (sessionId) => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore()

        return firestore.collection("speakers").get()
            .then((speakersSnapshot) => {
                let speakers = {}
                speakersSnapshot.forEach((doc) => {
                    speakers[doc.id] = doc.data()
                });

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
