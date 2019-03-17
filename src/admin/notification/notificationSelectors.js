const getNotifications = state => state.adminNotifications
const getLastNotifications = state =>
    getNotifications(state).notifications.pop()
