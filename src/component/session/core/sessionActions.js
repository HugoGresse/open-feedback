import {
    GET_SESSIONS_SUCCESS,
    GET_SESSIONS_ERROR,
    SET_SESSION_FILTER,
    SET_SELECTED_SESSION,
    GET_SESSION_SUCCESS,
    GET_SESSION_ERROR
} from './sessionActionTypes'
import { formatSessionsWithScheduled } from './sessionUtils'
import { fireStoreScheduleInstance } from '../../../firebase'

export const getSession = sessionId => {
    return (dispatch, getState) => {
        const schedulePromise = fireStoreScheduleInstance
            .collection('schedule')
            .get()
        const sessionsPromise = fireStoreScheduleInstance
            .collection('sessions')
            .doc(sessionId)
            .get()

        return Promise.all([schedulePromise, sessionsPromise])
            .then(([resultSchedule, resultSessions]) => {
                let sessions = {}
                let schedule = []

                sessions[sessionId] = {
                    ...resultSessions.data(),
                    id: resultSessions.id
                }

                resultSchedule.forEach(doc => {
                    schedule.push(doc.data())
                })

                dispatch({
                    type: GET_SESSION_SUCCESS,
                    payload: formatSessionsWithScheduled(sessions, schedule)
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_SESSION_ERROR,
                    payload: err
                })
            })
    }
}

export const getSessions = () => {
    return (dispatch, getState) => {
        const schedulePromise = fireStoreScheduleInstance
            .collection('schedule')
            .get()
        const sessionsPromise = fireStoreScheduleInstance
            .collection('sessions')
            .get()

        return Promise.all([schedulePromise, sessionsPromise])
            .then(([resultSchedule, resultSessions]) => {
                let sessions = {}
                let schedule = []
                resultSessions.forEach(doc => {
                    sessions[doc.id] = {
                        ...doc.data(),
                        id: doc.id
                    }
                })

                resultSchedule.forEach(doc => {
                    schedule.push(doc.data())
                })

                dispatch({
                    type: GET_SESSIONS_SUCCESS,
                    payload: formatSessionsWithScheduled(sessions, schedule)
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_SESSIONS_ERROR,
                    payload: err
                })
            })
    }
}

export const setSessionFilter = filter => {
    return dispatch => {
        dispatch({
            type: SET_SESSION_FILTER,
            payload: filter
        })
    }
}

export const setSelectedSession = sessionId => {
    return dispatch => {
        dispatch({
            type: SET_SELECTED_SESSION,
            payload: sessionId
        })
    }
}
