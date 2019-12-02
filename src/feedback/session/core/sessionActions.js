import {
    GET_SESSION_ERROR,
    GET_SESSION_SUCCESS,
    SET_SELECTED_SESSION,
} from './sessionActionTypes'
import { SET_SESSIONS_FILTER } from '../../../core/sessions/sessionsActionTypes'
import { projectApi } from '../../../core/setupType/projectApi'

export const getSession = sessionId => {
    return dispatch => {
        projectApi
            .getSession(sessionId)
            .then(sessionWithSchedule => {
                dispatch({
                    type: GET_SESSION_SUCCESS,
                    payload: sessionWithSchedule,
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_SESSION_ERROR,
                    payload: err.toString(),
                })
            })
    }
}

export const setSelectedSession = sessionId => {
    return dispatch => {
        dispatch({
            type: SET_SELECTED_SESSION,
            payload: sessionId,
        })

        dispatch({
            type: SET_SESSIONS_FILTER,
            payload: '',
        })
    }
}
