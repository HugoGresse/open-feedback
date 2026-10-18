import {
    GET_TALK_ERROR,
    SET_SELECTED_TALK,
    type TalkAction,
} from './talkActionTypes'

export interface TalkState {
    /** Id of the talk displayed by the Talk page. */
    selected: string | null
    errorTalkLoad: string | null
    loading?: boolean
}

const initState: TalkState = {
    selected: null,
    errorTalkLoad: null,
}

export const talkReducer = (
    state: TalkState = initState,
    action: TalkAction
): TalkState => {
    switch (action.type) {
        case SET_SELECTED_TALK:
            return {
                ...state,
                selected: action.payload,
            }
        case GET_TALK_ERROR:
            return {
                ...state,
                errorTalkLoad: action.payload,
                loading: false,
            }

        default:
            return state
    }
}
