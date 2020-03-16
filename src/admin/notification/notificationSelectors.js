import { getAdminStateSelector } from '../adminSelector'

const getNotifications = state =>
    getAdminStateSelector(state).adminNotifications

export const getNotificationsSelector = state =>
    getNotifications(state).notifications

export const getCurrentNotificationSelector = state =>
    getNotifications(state).current

export const isNotificationOpenSelector = state =>
    getNotifications(state).isOpen
