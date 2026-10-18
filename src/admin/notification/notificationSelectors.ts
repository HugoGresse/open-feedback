import type { RootState } from '../../store'
import { getAdminStateSelector } from '../adminSelector'
import type { AdminNotification } from './notificationActionTypes'
import type { NotificationState } from './notificationReducer'

const getNotifications = (state: RootState): NotificationState =>
    getAdminStateSelector(state).adminNotifications

export const getNotificationsSelector = (
    state: RootState
): AdminNotification[] => getNotifications(state).notifications

export const getCurrentNotificationSelector = (
    state: RootState
): AdminNotification | null => getNotifications(state).current

export const isNotificationOpenSelector = (state: RootState): boolean =>
    getNotifications(state).isOpen
