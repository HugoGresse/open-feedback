import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION
} from './notificationActionTypes'

const initState = {
    notifications: []
}

const notificationReducer = (state = initState, { payload, type }) => {
    switch (type) {
        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.concat([payload])
            }
        case REMOVE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(item => {
                    return (
                        item.type !== payload.type &&
                        item.message !== payload.message
                    )
                })
            }
        default:
            return state
    }
}

export default notificationReducer
