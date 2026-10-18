import { combineReducers } from 'redux'
import { authReducer } from './auth/authReducer'
import { projectReducer } from './project/core/projectReducer'
import { notificationReducer } from './notification/notificationReducer'
import { adminDashboardReducer } from './project/dashboard/dashboardReducer'
import { votingFormReducer } from './project/settings/votingForm/votingFormReducer'
import { usersReducer } from './users/core/usersReducer'
import { adminModerationReducer } from './project/moderation/moderationReducer'
import { adminOrganizationReducer } from './organization/core/organizationReducer'

export const adminReducer = combineReducers({
    adminAuth: authReducer,
    adminProject: projectReducer,
    adminNotifications: notificationReducer,
    adminDashboard: adminDashboardReducer,
    adminVotingForm: votingFormReducer,
    adminUsers: usersReducer,
    adminModeration: adminModerationReducer,
    adminOrganization: adminOrganizationReducer,
})
