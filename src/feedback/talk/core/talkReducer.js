import { GET_TALK_ERROR, SET_SELECTED_TALK } from './talkActionTypes'

const initState = {
    selected: null,
    errorTalkLoad: null,
}

const talkReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case SET_SELECTED_TALK:
            return {
                ...state,
                selected: payload,
            }
        case GET_TALK_ERROR:
            return {
                ...state,
                errorTalkLoad: payload,
                loading: false,
            }

        default:
            return state
    }
}

export default talkReducer
