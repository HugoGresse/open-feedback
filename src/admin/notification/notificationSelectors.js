const getNotifications = state => state.adminNotifications
export const getLastNotificationsSelector = state =>
    getNotifications(state).notifications[0]
