import {
    GET_PROJECT_SUCCESS,
    GET_PROJECT_ERROR,
    GET_PROJECT_VOTE_ITEMS_ERROR,
    GET_PROJECT_VOTE_ITEMS_SUCCESS,
    GET_PROJECT_VOTE_RESULT_ERROR,
    GET_PROJECT_VOTE_RESULT_SUCCESS,
    INCREMENT_VOTE_LOCALY,
    SET_SELECTED_DATE
} from './projectActionTypes'

const initState = {
    data: {
        contact: null,
        favicon: null,
        firebaseConfig: null,
        logoSmall: null,
        name: null,
        id: null,
        voteItems: null,
        sessionVotes: null,
        chipColors: []
    },
    selectedDate: '',
    projectLoadError: null,
    projectVotesError: null
}

const projectReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_PROJECT_SUCCESS:
            return {
                ...state,
                data: {
                    ...payload
                }
            }
        case GET_PROJECT_VOTE_ITEMS_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    voteItems: payload.filter(
                        voteItem => voteItem['type'] === 'boolean'
                    )
                }
            }

        case GET_PROJECT_VOTE_RESULT_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    sessionVotes: payload
                }
            }
        case INCREMENT_VOTE_LOCALY:
            const vote = payload.vote
            const data = state.data
            if (!data.sessionVotes || !data.sessionVotes[vote.sessionId]) {
                return {
                    ...state,
                    data: {
                        ...data,
                        sessionVotes: {
                            ...data.sessionVotes,
                            [vote.sessionId]: {
                                [vote.voteItemId]: payload.amount
                            }
                        }
                    }
                }
            }

            if (!data.sessionVotes[vote.sessionId][vote.voteItemId]) {
                return {
                    ...state,
                    data: {
                        ...data,
                        sessionVotes: {
                            ...data.sessionVotes,
                            [vote.sessionId]: {
                                ...data.sessionVotes[vote.sessionId],
                                [vote.voteItemId]: payload.amount
                            }
                        }
                    }
                }
            }
            return {
                ...state,
                data: {
                    ...data,
                    sessionVotes: {
                        ...data.sessionVotes,
                        [vote.sessionId]: {
                            ...data.sessionVotes[vote.sessionId],
                            [vote.voteItemId]:
                                data.sessionVotes[vote.sessionId][
                                    vote.voteItemId
                                ] + payload.amount
                        }
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

        case SET_SELECTED_DATE:
            return {
                ...state,
                selectedDate: payload.date
            }
        default:
            return state
    }
}

export default projectReducer
