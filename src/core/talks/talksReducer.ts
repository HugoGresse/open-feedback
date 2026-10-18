import {
    ADD_TALK_ERROR,
    ADD_TALK_SUCCESS,
    EDIT_TALK_ERROR,
    EDIT_TALK_SUCCESS,
    GET_TALKS_ERROR,
    GET_TALKS_LOADING,
    GET_TALKS_SUCCESS,
    REMOVE_TALK_ERROR,
    REMOVE_TALK_SUCCESS,
    SET_TALKS_FILTER,
    type TalksAction,
} from './talksActionTypes'
import {
    GET_TALK_SUCCESS,
    type GetTalkSuccessAction,
} from '../../feedback/talk/core/talkActionTypes'
import type { TalksMap } from '../models'

export interface TalksState {
    list: TalksMap
    filter: string | null
    errorTalksLoad: string | null
    loading: boolean
    loaded: boolean
}

const initState: TalksState = {
    list: {},
    filter: null,
    errorTalksLoad: null,
    loading: false,
    loaded: false,
}

export const talksReducer = (
    state: TalksState = initState,
    action: TalksAction | GetTalkSuccessAction
): TalksState => {
    switch (action.type) {
        case GET_TALK_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    ...action.payload,
                },
            }
        case GET_TALKS_LOADING:
            return {
                ...state,
                loading: true,
            }
        case GET_TALKS_SUCCESS:
            return {
                ...state,
                list: action.payload,
                loading: false,
                loaded: true,
            }
        case SET_TALKS_FILTER:
            return {
                ...state,
                filter: action.payload,
            }
        case ADD_TALK_SUCCESS:
        case EDIT_TALK_SUCCESS:
            return {
                ...state,
                list: {
                    ...state.list,
                    [action.payload.id]: action.payload,
                },
            }
        case REMOVE_TALK_SUCCESS: {
            const { [action.payload.id]: value, ...list } = state.list

            return {
                ...state,
                list,
            }
        }
        case ADD_TALK_ERROR:
        case EDIT_TALK_ERROR:
        case REMOVE_TALK_ERROR:
            // biome-ignore lint/suspicious/noConsole: intentional log
            console.error(action.type, action.payload)
            return state
        case GET_TALKS_ERROR:
            // biome-ignore lint/suspicious/noConsole: intentional log
            console.error(action.type, action.payload)
            return {
                ...state,
                errorTalksLoad: action.payload,
            }
        default:
            return state
    }
}
