import {
    CLEAR_SESSION_VOTES,
    GET_SESSION_VOTES_SUCCESS
} from './dashboardActionTypes'

const initState = {
    data: {
        sessionVotes: []
    },
    sessionVotesLoaded: false,
    sessionVotesError: null
}

const adminDashboardReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_SESSION_VOTES_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    sessionVotes: payload,
                    sessionVotesLoaded: true
                }
            }
        case CLEAR_SESSION_VOTES:
            return initState
        default:
            return state
    }
}

export default adminDashboardReducer
