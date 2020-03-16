import {
    ADD_NOTIFICATION,
    SET_CURRENT_NOTIFICATION,
    SET_OPEN_NOTIFICATION,
} from './notificationActionTypes'

const initState = {
    notifications: [],
    current: null,
    isOpen: false,
}

const notificationReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.concat([payload]),
            }
        case SET_OPEN_NOTIFICATION:
            return {
                ...state,
                isOpen: payload,
            }
        case SET_CURRENT_NOTIFICATION:
            return {
                ...state,
                current: payload,
                notifications: state.notifications.filter(
                    item => item.key !== payload.key
                ),
            }
        default:
            return state
    }
}

export default notificationReducer
