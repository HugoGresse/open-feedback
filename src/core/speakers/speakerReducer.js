import {
    FILTER_SPEAKER,
    GET_SPEAKER_ERROR,
    GET_SPEAKER_SUCCESS,
    GET_SPEAKERS_ERROR,
    GET_SPEAKERS_SUCCESS
} from './speakerActionTypes'
import { SELECT_PROJECT } from "../../admin/project/core/projectActionTypes"

const initState = {
    list: {},
    filter: "",
    selected: null,
}

const speakerReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_SPEAKER_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    ...payload
                }
            }
        case GET_SPEAKERS_SUCCESS:
            return {
                ...state,
                list: payload
            }
        case FILTER_SPEAKER:
            return {
                ...state,
                filter: payload
            }
        case SELECT_PROJECT:
            return initState
        case GET_SPEAKER_ERROR:
        case GET_SPEAKERS_ERROR:
            console.log(payload)
            return state
        default:
            return state
    }
}

export default speakerReducer
