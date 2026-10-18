import {
    CLEAR_TALK_VOTES,
    type DashboardAction,
    type DashboardTalkVotes,
    type DashboardUserVote,
    GET_TALK_VOTES_SUCCESS,
    GET_USER_VOTES_SUCCESS,
} from './dashboardActionTypes'
import { LOGOUT, type LogoutAction } from '../../auth/authActionTypes'

export interface AdminDashboardState {
    data: {
        talkVotes: Record<string, DashboardTalkVotes>
        userVotes: DashboardUserVote[]
    }
    talkVotesLoaded: boolean
    talkVotesError: string | null
    userVotesLoaded: boolean
}

const initState: AdminDashboardState = {
    data: {
        talkVotes: {},
        userVotes: [],
    },
    talkVotesLoaded: false,
    talkVotesError: null,
    userVotesLoaded: false,
}

export const adminDashboardReducer = (
    state: AdminDashboardState = initState,
    action: DashboardAction | LogoutAction
): AdminDashboardState => {
    switch (action.type) {
        case GET_TALK_VOTES_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    talkVotes: action.payload,
                },
                talkVotesLoaded: true,
            }
        case GET_USER_VOTES_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    userVotes: action.payload,
                },
                userVotesLoaded: true,
            }
        case LOGOUT:
        case CLEAR_TALK_VOTES:
            return initState
        default:
            return state
    }
}
