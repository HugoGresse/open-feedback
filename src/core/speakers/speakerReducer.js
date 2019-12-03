import {
    ADD_SPEAKER_ERROR,
    ADD_SPEAKER_SUCCESS,
    EDIT_SPEAKER_ERROR,
    EDIT_SPEAKER_SUCCESS,
    FILTER_SPEAKER,
    GET_SPEAKER_ERROR,
    GET_SPEAKER_SUCCESS,
    GET_SPEAKERS_ERROR,
    GET_SPEAKERS_SUCCESS,
    REMOVE_SPEAKER_ERROR,
    REMOVE_SPEAKER_SUCCESS,
} from './speakerActionTypes'
import { SELECT_PROJECT } from '../../admin/project/core/projectActionTypes'

const initState = {
    list: {},
    filter: '',
    selected: null,
}

const speakerReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_SPEAKER_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    ...payload,
                },
            }
        case GET_SPEAKERS_SUCCESS:
            return {
                ...state,
                list: payload,
            }
        case FILTER_SPEAKER:
            return {
                ...state,
                filter: payload,
            }
        case SELECT_PROJECT:
            return initState
        case ADD_SPEAKER_SUCCESS:
        case EDIT_SPEAKER_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    [payload.id]: payload,
                },
            }
        case REMOVE_SPEAKER_SUCCESS: {
            const {
                // eslint-disable-next-line no-unused-vars
                [payload.id]: value,
                ...list
            } = state.list

            return {
                ...state,
                list: {
                    ...list,
                },
            }
        }
        case ADD_SPEAKER_ERROR:
        case EDIT_SPEAKER_ERROR:
        case REMOVE_SPEAKER_ERROR:
        case GET_SPEAKER_ERROR:
        case GET_SPEAKERS_ERROR:
            // eslint-disable-next-line no-console
            console.warn(payload)
            return state
        default:
            return state
    }
}

export default speakerReducer
