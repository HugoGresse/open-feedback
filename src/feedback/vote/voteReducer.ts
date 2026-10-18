import {
    ADD_VOTE_BEFORE_SUCCESS,
    ADD_VOTE_ERROR,
    ADD_VOTE_SUCCESS,
    DELETE_VOTE_LOAD_ERROR,
    DELETE_VOTE_POST_ERROR,
    GET_USER_VOTES_ERROR,
    GET_USER_VOTES_SUCCESS,
    REMOVE_VOTE_BEFORE_SUCCESS,
    REMOVE_VOTE_SUCCESS,
    UPDATE_VOTE_ERROR,
    UPDATE_VOTE_SUCCESS,
    type VoteAction,
} from './voteActionTypes'
import { VOTE_STATUS_DELETED } from '../../core/contants'
import type { VotesMap } from '../../core/models'

export interface VoteState {
    /** The current user votes of the project, keyed by vote id. */
    currentUserVotes: VotesMap
    errorVotePost: string | null
    errorVotesLoad: string | null
}

const initState: VoteState = {
    currentUserVotes: {},
    errorVotePost: null,
    errorVotesLoad: null,
}

export const voteReducer = (
    state: VoteState = initState,
    action: VoteAction
): VoteState => {
    switch (action.type) {
        case GET_USER_VOTES_SUCCESS:
            return {
                ...state,
                currentUserVotes: action.payload,
            }
        case ADD_VOTE_BEFORE_SUCCESS:
            return {
                ...state,
                currentUserVotes: {
                    ...state.currentUserVotes,
                    ...action.payload,
                },
            }
        case ADD_VOTE_SUCCESS: {
            const newVoteState = {
                ...state.currentUserVotes,
                [action.payload.voteId]: {
                    ...state.currentUserVotes[action.payload.voteId],
                    pending: false,
                },
            }

            return {
                ...state,
                currentUserVotes: newVoteState,
            }
        }
        case ADD_VOTE_ERROR: {
            const { payload } = action
            const newVoteState = {
                ...state.currentUserVotes,
            }
            if (payload.voteId !== undefined) {
                delete newVoteState[payload.voteId]
            }
            if (payload.voteToRestore) {
                // The write failed: put the vote back as it was
                const vote = payload.voteToRestore
                newVoteState[vote.id] = {
                    ...vote,
                    pending: false,
                }
            }

            // eslint-disable-next-line no-console
            console.error(payload.error)

            return {
                ...state,
                currentUserVotes: newVoteState,
                errorVotePost: payload.error.toString(),
            }
        }
        case REMOVE_VOTE_BEFORE_SUCCESS: {
            const removeVotesState: VotesMap = {
                ...state.currentUserVotes,
                [action.payload.id]: {
                    ...state.currentUserVotes[action.payload.id],
                    status: VOTE_STATUS_DELETED,
                    pending: true,
                },
            }
            return {
                ...state,
                currentUserVotes: removeVotesState,
            }
        }
        case REMOVE_VOTE_SUCCESS: {
            const newVoteState = {
                ...state.currentUserVotes,
                [action.payload.id]: {
                    ...state.currentUserVotes[action.payload.id],
                    pending: false,
                    // status already changed in REMOVE_VOTE_BEFORE_SUCCESS
                },
            }

            return {
                ...state,
                currentUserVotes: newVoteState,
            }
        }
        case GET_USER_VOTES_ERROR:
            // eslint-disable-next-line no-console
            console.error(action.payload)
            return {
                ...state,
                errorVotesLoad: action.payload.toString(),
            }
        case DELETE_VOTE_POST_ERROR:
            return {
                ...state,
                errorVotePost: null,
            }
        case DELETE_VOTE_LOAD_ERROR:
            return {
                ...state,
                errorVotesLoad: null,
            }
        case UPDATE_VOTE_SUCCESS:
            return {
                ...state,
                currentUserVotes: {
                    ...state.currentUserVotes,
                    ...action.payload.vote,
                },
            }
        case UPDATE_VOTE_ERROR:
            return {
                ...state,
                errorVotePost: action.payload.error.toString(),
            }
        default:
            return state
    }
}
