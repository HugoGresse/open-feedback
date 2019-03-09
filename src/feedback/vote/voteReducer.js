import {
    ADD_VOTE_BEFORE_SUCCESS,
    ADD_VOTE_ERROR,
    ADD_VOTE_SUCCESS,
    DELETE_VOTE_LOAD_ERROR,
    DELETE_VOTE_POST_ERROR,
    GET_USER_VOTES_ERROR,
    GET_USER_VOTES_SUCCESS,
    REMOVE_VOTE_BEFORE_SUCCESS,
    REMOVE_VOTE_ERROR,
    REMOVE_VOTE_SUCCESS,
    UPDATE_VOTE_ERROR,
    UPDATE_VOTE_SUCCESS
} from './voteActionTypes'

const initState = {
    currentUserVotes: {},
    errorVotePost: null,
    errorVotesLoad: null
}

export const VOTE_TYPE_BOOLEAN = 'boolean'
export const VOTE_TYPE_TEXT = 'text'

const voteReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_USER_VOTES_SUCCESS:
            return {
                ...state,
                currentUserVotes: payload
            }
        case ADD_VOTE_BEFORE_SUCCESS:
            return {
                ...state,
                currentUserVotes: {
                    ...state.currentUserVotes,
                    ...payload
                }
            }
        case ADD_VOTE_SUCCESS:
            const newVotes = {
                ...state.currentUserVotes,
                ...payload.vote
            }
            delete newVotes[payload.tempVoteId]

            return {
                ...state,
                currentUserVotes: newVotes
            }
        case ADD_VOTE_ERROR:
            const newVoteState = {
                ...state.currentUserVotes
            }
            delete newVoteState[payload.tempVoteId]

            console.error(payload.error)

            return {
                ...state,
                currentUserVotes: newVoteState,
                errorVotePost: payload.error.toString()
            }
        case REMOVE_VOTE_BEFORE_SUCCESS:
            const removeVotesState = {
                ...state.currentUserVotes
            }
            delete removeVotesState[payload.id]
            return {
                ...state,
                currentUserVotes: removeVotesState
            }
        case REMOVE_VOTE_SUCCESS:
            // Do nothing, state already change in REMOVE_VOTE_BEFORE_SUCCESS
            return {
                ...state
            }
        case REMOVE_VOTE_ERROR:
            console.error(payload.error)
            return {
                ...state,
                errorVotePost: payload.error.toString()
            }
        case GET_USER_VOTES_ERROR:
            console.error(payload)
            return {
                ...state,
                errorVotesLoad: payload.toString()
            }
        case DELETE_VOTE_POST_ERROR:
            return {
                ...state,
                errorVotePost: null
            }
        case DELETE_VOTE_LOAD_ERROR:
            return {
                ...state,
                errorVotesLoad: null
            }
        case UPDATE_VOTE_SUCCESS:
            return {
                ...state,
                currentUserVotes: {
                    ...state.currentUserVotes,
                    ...payload.vote
                }
            }
        case UPDATE_VOTE_ERROR:
            return {
                ...state,
                errorVotePost: payload.error.toString()
            }
        default:
            return state
    }
}

export default voteReducer
