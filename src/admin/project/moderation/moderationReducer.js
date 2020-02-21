import {
    GET_TEXT_VOTES_SUCCESS,
    HIDE_VOTE_SUCCESS,
    UNHIDE_VOTE_SUCCESS,
} from './moderationActionTypes'
import { LOGOUT } from '../../auth/authActionTypes'
import { SELECT_PROJECT } from '../core/projectActionTypes'
import { VOTE_STATUS_ACTIVE, VOTE_STATUS_HIDDEN } from '../../../core/contants'

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
        case HIDE_VOTE_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    textVotes: {
                        ...state.data.textVotes,
                        [payload.talkId]: state.data.textVotes[
                            payload.talkId
                        ].map(vote =>
                            vote.voteId === payload.voteId
                                ? { ...vote, status: VOTE_STATUS_HIDDEN }
                                : vote
                        ),
                    },
                },
            }
        case UNHIDE_VOTE_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    textVotes: {
                        ...state.data.textVotes,
                        [payload.talkId]: state.data.textVotes[
                            payload.talkId
                        ].map(vote =>
                            vote.voteId === payload.voteId
                                ? { ...vote, status: VOTE_STATUS_ACTIVE }
                                : vote
                        ),
                    },
                },
            }
        case LOGOUT:
        case SELECT_PROJECT:
            return initState
        default:
            return state
    }
}

export default adminModerationReducer
