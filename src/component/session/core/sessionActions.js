import {
  GET_SESSION_SUCCESS,
  GET_SESSION_ERROR,
  SET_SESSION_FILTER
} from "./sessionActionTypes";
import { formatSessionsWithScheduled } from "./sessionUtils";

export const getSessions = () => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const schedulePromise = firestore.collection("schedule").get();
    const sessionsPromise = firestore.collection("sessions").get();

    return Promise.all([schedulePromise, sessionsPromise])
      .then(([resultSchedule, resultSessions]) => {
        let sessions = {};
        let schedule = [];
        resultSessions.forEach(doc => {
          sessions[doc.id] = doc.data();
        });

        resultSchedule.forEach(doc => {
          schedule.push(doc.data());
        });

        dispatch({
          type: GET_SESSION_SUCCESS,
          payload: formatSessionsWithScheduled(sessions, schedule)
        });
        // return // something using both resultA and resultB
      })
      .catch(err => {
        dispatch({
          type: GET_SESSION_ERROR,
          error: err
        });
      });
  };
};

export const setSessionFilter = filter => {
  return dispatch => {
    dispatch({
      type: SET_SESSION_FILTER,
      payload: filter
    });
  };
};
