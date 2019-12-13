import {
    GET_TALK_ERROR,
    GET_TALK_SUCCESS,
    SET_SELECTED_TALK,
} from './talkActionTypes'
import { SET_TALKS_FILTER } from '../../../core/talks/talksActionTypes'
import { projectApi } from '../../../core/setupType/projectApi'

export const getTalk = talkId => {
    return dispatch => {
        projectApi
            .getTalk(talkId)
            .then(talkWithSchedule => {
                dispatch({
                    type: GET_TALK_SUCCESS,
                    payload: talkWithSchedule,
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_TALK_ERROR,
                    payload: err.toString(),
                })
            })
    }
}

export const setSelectedTalk = talkId => {
    return dispatch => {
        dispatch({
            type: SET_SELECTED_TALK,
            payload: talkId,
        })

        dispatch({
            type: SET_TALKS_FILTER,
            payload: '',
        })
    }
}
