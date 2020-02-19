import { GET_TEXT_VOTES_SUCCESS } from './moderationActionTypes'
import { LOGOUT } from '../../auth/authActionTypes'
import { SELECT_PROJECT } from '../core/projectActionTypes'

const initState = {
    data: {
        // { sessionId: [{...vote1}, {...vote2}], sessionId2: ... }
        textVotes: {},
    },
    textVotesLoaded: false,
    textVotesError: null,
}

const adminModerationReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_TEXT_VOTES_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    textVotes: {
                        ...state.data.textVotes,
                        ...payload,
                    },
                },
                textVotesLoaded: true,
            }
        case LOGOUT:
        case SELECT_PROJECT:
            return initState
        default:
            return state
    }
}

export default adminModerationReducer
