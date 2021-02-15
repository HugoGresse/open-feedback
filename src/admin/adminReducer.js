import { combineReducers } from 'redux'
import adminAuthReducer from './auth/authReducer'
import projectReducer from './project/core/projectReducer'
import adminNotificationReducer from './notification/notificationReducer'
import adminDashboardReducer from './project/dashboard/dashboardReducer'
import votingFormReducer from './project/settings/votingForm/votingFormReducer'
import adminUsersReducer from './users/usersReducer'
import adminModerationReducer from './project/moderation/moderationReducer'
import { adminOrganizationReducer } from './organization/core/organizationReducer'

const adminReducer = combineReducers({
    adminAuth: adminAuthReducer,
    adminProject: projectReducer,
    adminNotifications: adminNotificationReducer,
    adminDashboard: adminDashboardReducer,
    adminVotingForm: votingFormReducer,
    adminUsers: adminUsersReducer,
    adminModeration: adminModerationReducer,
    adminOrganization: adminOrganizationReducer,
})

export default adminReducer
