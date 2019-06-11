import {
    GET_SESSIONS_ERROR,
    GET_SESSIONS_LOADING,
    GET_SESSIONS_SUCCESS,
    SET_SESSIONS_FILTER
} from './sessionsActionTypes'
import { formatSessionsWithScheduled } from './sessionsUtils'
import { fireStoreScheduleInstance } from '../../../firebase'

export const getSessions = () => {
    return (dispatch, getState) => {
        dispatch({
            type: GET_SESSIONS_LOADING
        })
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
                let temp
                resultSessions.forEach(doc => {
                    temp = doc.data()
                    if (temp.hideInFeedback) {
                        // Some sessions are not display (break time, etc)
                        return
                    }
                    sessions[doc.id] = {
                        ...temp,
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
                    payload: err.toString()
                })
            })
    }
}

export const setSessionsFilter = filter => {
    return dispatch => {
        dispatch({
            type: SET_SESSIONS_FILTER,
            payload: filter
        })
    }
}
