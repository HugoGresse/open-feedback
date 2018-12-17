import {List, Record} from 'immutable'
import {
    GET_SCHEDULE_ERROR,
    GET_SCHEDULE_SUCCESS
} from "./scheduleActionTypes"

const initState = new Record({
    list: new List()
})

const scheduleReducer = (state = new initState(), { payload, type }) => {
    switch (type) {
        case GET_SCHEDULE_SUCCESS:
            return state.merge({
                list: payload
            })
        case GET_SCHEDULE_ERROR:
            console.log(payload)
        default:
            return state;
    }
};

export default scheduleReducer;