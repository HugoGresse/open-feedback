import { GET_PROJECT_SUCCESS, GET_PROJECT_ERROR } from './projectActionTypes'

const initState = {
    currentProject: null
}

const projectReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case GET_PROJECT_SUCCESS:
            return {
                ...state,
                currentProject: payload
            }
        case GET_PROJECT_ERROR:
            console.log(payload)
            return state
        default:
            return state
    }
}

export default projectReducer
