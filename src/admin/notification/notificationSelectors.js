import { getAdminStateSelector } from '../adminSelector'

const getNotifications = state =>
    getAdminStateSelector(state).adminNotifications
export const getLastNotificationsSelector = state =>
    getNotifications(state).notifications[0]
