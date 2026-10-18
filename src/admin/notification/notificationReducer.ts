import {
    ADD_NOTIFICATION,
    type AdminNotification,
    type NotificationAction,
    SET_CURRENT_NOTIFICATION,
    SET_OPEN_NOTIFICATION,
} from './notificationActionTypes'

export interface NotificationState {
    notifications: AdminNotification[]
    current: AdminNotification | null
    isOpen: boolean
}

const initState: NotificationState = {
    notifications: [],
    current: null,
    isOpen: false,
}

export const notificationReducer = (
    state: NotificationState = initState,
    action: NotificationAction
): NotificationState => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.concat([action.payload]),
            }
        case SET_OPEN_NOTIFICATION:
            return {
                ...state,
                isOpen: action.payload,
            }
        case SET_CURRENT_NOTIFICATION: {
            const { payload } = action
            return {
                ...state,
                current: payload,
                notifications: state.notifications.filter(
                    (item) => item.key !== payload.key
                ),
            }
        }
        default:
            return state
    }
}
