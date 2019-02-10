import {
    GET_PROJECT_SUCCESS,
    GET_PROJECT_ERROR,
    GET_PROJECT_VOTE_ITEMS_ERROR,
    GET_PROJECT_VOTE_ITEMS_SUCCESS,
    GET_PROJECT_VOTE_RESULT_ERROR,
    GET_PROJECT_VOTE_RESULT_SUCCESS,
    INCREMENT_VOTE_LOCALY
} from './projectActionTypes'

const initState = {
    contact: null,
    favicon: null,
    firebaseConfig: null,
    logoSmall: null,
    name: null,
    id: null,
    voteItems: null,
    sessionVotes: null,
    projectLoadError: null,
    projectVotesError: null,
    chipColors: []
}

const projectReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_PROJECT_SUCCESS:
            return {
                ...payload
            }
        case GET_PROJECT_VOTE_ITEMS_SUCCESS:
            return {
                ...state,
                voteItems: payload
            }
        case GET_PROJECT_VOTE_RESULT_SUCCESS:
            return {
                ...state,
                sessionVotes: payload
            }
        case INCREMENT_VOTE_LOCALY:
            const vote = payload.vote
            if (!state.sessionVotes || !state.sessionVotes[vote.sessionId]) {
                return {
                    ...state,
                    sessionVotes: {
                        ...state.sessionVotes,
                        [vote.sessionId]: {
                            [vote.voteItemId]: payload.amount
                        }
                    }
                }
            }

            if (!state.sessionVotes[vote.sessionId][vote.voteItemId]) {
                return {
                    ...state,
                    sessionVotes: {
                        ...state.sessionVotes,
                        [vote.sessionId]: {
                            ...state.sessionVotes[vote.sessionId],
                            [vote.voteItemId]: payload.amount
                        }
                    }
                }
            }
            return {
                ...state,
                sessionVotes: {
                    ...state.sessionVotes,
                    [vote.sessionId]: {
                        ...state.sessionVotes[vote.sessionId],
                        [vote.voteItemId]:
                            state.sessionVotes[vote.sessionId][
                                vote.voteItemId
                            ] + payload.amount
                    }
                }
            }
        case GET_PROJECT_VOTE_RESULT_ERROR:
            console.error(payload)
            return {
                ...state,
                projectVotesError: payload
            }
        case GET_PROJECT_VOTE_ITEMS_ERROR:
        case GET_PROJECT_ERROR:
            console.error(payload)
            return {
                ...state,
                projectLoadError: payload
            }
        default:
            return state
    }
}

export default projectReducer
