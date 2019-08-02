import {
    GET_SESSION_ERROR,
    GET_SESSION_SUCCESS,
    SET_SELECTED_SESSION
} from './sessionActionTypes'
import { formatSessionsWithScheduled } from '../../../core/sessions/sessionsUtils'
import { SET_SESSIONS_FILTER } from '../../../core/sessions/sessionsActionTypes'
import { getFirestoreSchedule } from '../../../firebase'
import { getProjectFirebaseConfigSelector } from '../../project/projectSelectors'

export const getSession = sessionId => {
    return (dispatch, getState) => {
        const firestore = getFirestoreSchedule(
            getProjectFirebaseConfigSelector(getState()).projectId
        )
        const schedulePromise = firestore.collection('schedule').get()
        const sessionsPromise = firestore
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
