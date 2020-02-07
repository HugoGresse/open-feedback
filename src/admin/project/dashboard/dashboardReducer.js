import {
    GET_TALK_VOTES_SUCCESS,
    GET_USER_VOTES_SUCCESS,
} from './dashboardActionTypes'
import { LOGOUT } from '../../auth/authActionTypes'
import { SELECT_PROJECT } from '../core/projectActionTypes'

const initState = {
    data: {
        talkVotes: [],
        userVotes: [],
    },
    talkVotesLoaded: false,
    talkVotesError: null,
    userVotesLoaded: false,
}

const adminDashboardReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_TALK_VOTES_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    talkVotes: payload,
                },
                talkVotesLoaded: true,
            }
        case GET_USER_VOTES_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    userVotes: payload,
                },
                userVotesLoaded: true,
            }
        case LOGOUT:
        case SELECT_PROJECT:
            return initState
        default:
            return state
    }
}

export default adminDashboardReducer
