import {
    GET_PROJECT_SUCCESS,
    GET_PROJECT_ERROR,
    GET_PROJECT_VOTE_ITEMS_ERROR,
    GET_PROJECT_VOTE_ITEMS_SUCCESS
} from './projectActionTypes'

const initState = {
    contact: null,
    favicon: null,
    firebaseConfig: null,
    logoSmall: null,
    name: null,
    id: null,
    voteItems: null
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
        case GET_PROJECT_VOTE_ITEMS_ERROR:
        case GET_PROJECT_ERROR:
            console.log(payload)
            return state
        default:
            return state
    }
}

export default projectReducer
