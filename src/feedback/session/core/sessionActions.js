import {
    GET_SESSION_ERROR,
    GET_SESSION_SUCCESS,
    SET_SELECTED_SESSION
} from './sessionActionTypes'
import { formatSessionsWithScheduled } from '../../sessions/core/sessionsUtils'
import { fireStoreScheduleInstance } from '../../../firebase'
import { SET_SESSIONS_FILTER } from '../../sessions/core/sessionsActionTypes'

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
                    payload: err.toString()
                })
            })
    }
}

export const setSelectedSession = sessionId => {
    return dispatch => {
        dispatch({
            type: SET_SELECTED_SESSION,
            payload: sessionId
        })

        dispatch({
            type: SET_SESSIONS_FILTER,
            payload: ''
        })
    }
}
