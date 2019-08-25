import { combineReducers } from 'redux'
import adminAuthReducer from './auth/authReducer'
import projectReducer from './project/core/projectReducer'
import adminNotificationReducer from './notification/notificationReducer'
import adminDashboardReducer from './project/dashboard/dashboardReducer'

const adminReducer = combineReducers({
    adminAuth: adminAuthReducer,
    adminProject: projectReducer,
    adminNotifications: adminNotificationReducer,
    adminDashboard: adminDashboardReducer
})

export default adminReducer
