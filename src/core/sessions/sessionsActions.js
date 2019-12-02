import {
    CLEAR_SESSIONS,
    GET_SESSIONS_ERROR,
    GET_SESSIONS_LOADING,
    GET_SESSIONS_SUCCESS,
    SET_SESSIONS_FILTER,
} from './sessionsActionTypes'
import { projectApi } from '../setupType/projectApi'

export const getSessions = () => {
    return dispatch => {
        dispatch({
            type: GET_SESSIONS_LOADING,
        })

        projectApi
            .getSessions()
            .then(sessionsWithSchedule => {
                dispatch({
                    type: GET_SESSIONS_SUCCESS,
                    payload: sessionsWithSchedule,
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_SESSIONS_ERROR,
                    payload: err.toString(),
                })
            })
    }
}

export const setSessionsFilter = filter => {
    return dispatch => {
        dispatch({
            type: SET_SESSIONS_FILTER,
            payload: filter,
        })
    }
}

export const clearSessions = () => {
    return dispatch => {
        dispatch({
            type: CLEAR_SESSIONS,
        })
    }
}
