import {
    ADD_VOTE_SUCCESS,
    ADD_VOTE_ERROR,
    GET_USER_VOTES_SUCCESS,
    GET_USER_VOTES_ERROR,
    ADD_VOTE_BEFORE_SUCCESS
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

            return {
                ...state,
                votes: newVoteState
            }
        // TODO : display something
        case GET_USER_VOTES_ERROR:
            console.log(payload)
            return state
        default:
            return state
    }
}

export default voteReducer
