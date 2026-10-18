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
    type SpeakersAction,
} from './speakerActionTypes'
import {
    SELECT_PROJECT,
    type SelectProjectAction,
} from '../../admin/project/core/projectActionTypes'
import type { SpeakersMap } from '../models'

export interface SpeakersState {
    list: SpeakersMap
    filter: string
    selected: string | null
}

const initState: SpeakersState = {
    list: {},
    filter: '',
    selected: null,
}

export const speakerReducer = (
    state: SpeakersState = initState,
    action: SpeakersAction | SelectProjectAction
): SpeakersState => {
    switch (action.type) {
        case GET_SPEAKER_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    ...action.payload,
                },
            }
        case GET_SPEAKERS_SUCCESS:
            return {
                ...state,
                list: action.payload,
            }
        case FILTER_SPEAKER:
            return {
                ...state,
                filter: action.payload,
            }
        case SELECT_PROJECT:
            return initState
        case ADD_SPEAKER_SUCCESS:
        case EDIT_SPEAKER_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    [action.payload.id]: action.payload,
                },
            }
        case REMOVE_SPEAKER_SUCCESS: {
            const {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                [action.payload.id]: value,
                ...list
            } = state.list

            return {
                ...state,
                list,
            }
        }
        case ADD_SPEAKER_ERROR:
        case EDIT_SPEAKER_ERROR:
        case REMOVE_SPEAKER_ERROR:
        case GET_SPEAKER_ERROR:
        case GET_SPEAKERS_ERROR:
            // eslint-disable-next-line no-console
            console.warn(action.payload)
            return state
        default:
            return state
    }
}
