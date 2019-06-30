import {
    CLEAR_SESSIONS,
    GET_SESSIONS_ERROR,
    GET_SESSIONS_LOADING,
    GET_SESSIONS_SUCCESS,
    SET_SESSIONS_FILTER
} from './sessionsActionTypes'
import { formatSessionsWithScheduled } from './sessionsUtils'
import { getFirestoreSchedule } from '../../firebase'
import { getProjectFirebaseConfigSelector } from '../../feedback/project/projectSelectors'

export const getSessions = () => {
    return (dispatch, getState) => {
        dispatch({
            type: GET_SESSIONS_LOADING
        })
        const firestore = getFirestoreSchedule(
            getProjectFirebaseConfigSelector(getState()).projectId
        )

        const schedulePromise = firestore.collection('schedule').get()
        const sessionsPromise = firestore.collection('sessions').get()

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

export const clearSessions = () => {
    return dispatch => {
        dispatch({
            type: CLEAR_SESSIONS
        })
    }
}
