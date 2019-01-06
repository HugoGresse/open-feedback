import { ADD_VOTE_SUCCESS, ADD_VOTE_ERROR } from './voteActionTypes'

const initState = {
    votes: {}
}

const voteReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case ADD_VOTE_SUCCESS:
            return {
                ...state,
                votes: {
                    ...state.votes,
                    ...payload
                }
            }
        case ADD_VOTE_ERROR:
            console.log(payload)
            return state
        default:
            return state
    }
}

export default voteReducer
