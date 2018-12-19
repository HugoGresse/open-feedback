import {
    GET_SCHEDULE_ERROR,
    GET_SCHEDULE_SUCCESS
} from "./scheduleActionTypes"

const initState = {
    list: []
}

const scheduleReducer = (state = initState, {payload, type}) => {
    switch (type) {
        case GET_SCHEDULE_SUCCESS:
            return {
                ...state,
                list: payload
            }
        case GET_SCHEDULE_ERROR:
            console.log(payload)
        default:
            return state
    }
}

export default scheduleReducer
