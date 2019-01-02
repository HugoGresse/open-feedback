import {
    GET_SPEAKER_ERROR,
    GET_SPEAKER_SUCCESS,
    GET_SPEAKERS_ERROR,
    GET_SPEAKERS_SUCCESS
} from './speakerActionTypes'

const initState = {
    list: {},
    filter: null,
    selected: null
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
        case GET_SPEAKER_ERROR:
        case GET_SPEAKERS_ERROR:
            console.log(payload)
            return state
        default:
            return state
    }
}

export default speakerReducer
