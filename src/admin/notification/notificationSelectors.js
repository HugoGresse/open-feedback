const getNotifications = state => state.adminNotifications
export const getLastNotifications = state =>
    getNotifications(state).notifications[0]
