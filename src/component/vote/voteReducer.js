import {
    ADD_VOTE_SUCCESS,
    ADD_VOTE_ERROR,
    GET_USER_VOTES_SUCCESS,
    GET_USER_VOTES_ERROR,
    ADD_VOTE_BEFORE_SUCCESS,
    REMOVE_VOTE_BEFORE_SUCCESS,
    REMOVE_VOTE_SUCCESS,
    REMOVE_VOTE_ERROR
} from './voteActionTypes'

const initState = {
    votes: {}
}

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

            console.log('error:', payload.error)

            // TODO : display something
            return {
                ...state,
                votes: newVoteState
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
            // TODO : display something
            console.log('error:', payload.error)
            return {
                ...state
            }
        case GET_USER_VOTES_ERROR:
            // TODO : display something
            console.log(payload)
            return state
        default:
            return state
    }
}

export default voteReducer
