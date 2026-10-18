import {
    GET_TEXT_VOTES_SUCCESS,
    HIDE_VOTE_SUCCESS,
    type ModerationAction,
    type ModerationTextVotes,
    UNHIDE_VOTE_SUCCESS,
} from './moderationActionTypes'
import { LOGOUT, type LogoutAction } from '../../auth/authActionTypes'
import {
    SELECT_PROJECT,
    type SelectProjectAction,
} from '../core/projectActionTypes'
import { VOTE_STATUS_ACTIVE, VOTE_STATUS_HIDDEN } from '../../../core/contants'

export interface AdminModerationState {
    data: {
        textVotes: ModerationTextVotes
    }
    textVotesLoaded: boolean
    textVotesError: string | null
}

const initState: AdminModerationState = {
    data: {
        // { sessionId: [{...vote1}, {...vote2}], sessionId2: ... }
        textVotes: {},
    },
    textVotesLoaded: false,
    textVotesError: null,
}

export const adminModerationReducer = (
    state: AdminModerationState = initState,
    action: ModerationAction | LogoutAction | SelectProjectAction
): AdminModerationState => {
    switch (action.type) {
        case GET_TEXT_VOTES_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    textVotes: {
                        ...state.data.textVotes,
                        ...action.payload,
                    },
                },
                textVotesLoaded: true,
            }
        case HIDE_VOTE_SUCCESS: {
            const payload = action.payload
            return {
                ...state,
                data: {
                    ...state.data,
                    textVotes: {
                        ...state.data.textVotes,
                        [payload.talkId]: state.data.textVotes[
                            payload.talkId
                        ].map((vote) =>
                            vote.voteId === payload.voteId
                                ? { ...vote, status: VOTE_STATUS_HIDDEN }
                                : vote
                        ),
                    },
                },
            }
        }
        case UNHIDE_VOTE_SUCCESS: {
            const payload = action.payload
            return {
                ...state,
                data: {
                    ...state.data,
                    textVotes: {
                        ...state.data.textVotes,
                        [payload.talkId]: state.data.textVotes[
                            payload.talkId
                        ].map((vote) =>
                            vote.voteId === payload.voteId
                                ? { ...vote, status: VOTE_STATUS_ACTIVE }
                                : vote
                        ),
                    },
                },
            }
        }
        case LOGOUT:
        case SELECT_PROJECT:
            return initState
        default:
            return state
    }
}
