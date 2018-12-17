import { GET_SCHEDULE_SUCCESS, GET_SCHEDULE_ERROR } from "./scheduleActionTypes"
import { List } from "immutable"

export const getSchedules = () => {
    return (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();

        firestore.collection('schedule')
            .get()
            .then((querySnapshot) => {
                let schedule = new List()
                querySnapshot.forEach((doc) => {
                    schedule = schedule.push(doc.data())
                });
                dispatch({
                    type: GET_SCHEDULE_SUCCESS,
                    payload: schedule
                });
            })
            .catch(err => {
                dispatch({
                    type: GET_SCHEDULE_ERROR,
                    error: err
                });
            });
    }
};