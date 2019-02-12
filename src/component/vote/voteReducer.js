import {
    ADD_VOTE_SUCCESS,
    ADD_VOTE_ERROR,
    GET_USER_VOTES_SUCCESS,
    GET_USER_VOTES_ERROR,
    ADD_VOTE_BEFORE_SUCCESS,
    REMOVE_VOTE_BEFORE_SUCCESS,
    REMOVE_VOTE_SUCCESS,
    REMOVE_VOTE_ERROR,
    DELETE_VOTE_POST_ERROR,
    DELETE_VOTE_LOAD_ERROR,
    UPDATE_VOTE_SUCCESS,
    UPDATE_VOTE_ERROR
} from './voteActionTypes'

const initState = {
    votes: {},
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
                votes: payload
            }
        case ADD_VOTE_BEFORE_SUCCESS:
            return {
                ...state,
                votes: {
                    ...state.votes,
                    ...payload
                }
            }
        case ADD_VOTE_SUCCESS:
            const newVotes = {
                ...state.votes,
                ...payload.vote
            }
            delete newVotes[payload.tempVoteId]

            return {
                ...state,
                votes: newVotes
            }
        case ADD_VOTE_ERROR:
            const newVoteState = {
                ...state.votes
            }
            delete newVoteState[payload.tempVoteId]

            console.error(payload.error)

            return {
                ...state,
                votes: newVoteState,
                errorVotePost: payload.error.toString()
            }
        case REMOVE_VOTE_BEFORE_SUCCESS:
            const removeVotesState = {
                ...state.votes
            }
            delete removeVotesState[payload.id]
            return {
                ...state,
                votes: removeVotesState
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
                votes: {
                    ...state.votes,
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
