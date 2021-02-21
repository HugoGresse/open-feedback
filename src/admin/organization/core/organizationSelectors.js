import { getAdminStateSelector } from '../../adminSelector'
import { createSelector } from 'reselect'
import {
    ORGANIZATION_USER_ROLE_ADMIN,
    ORGANIZATION_USER_ROLE_EDITOR,
    ORGANIZATION_USER_ROLE_OWNER,
    ORGANIZATION_USER_ROLE_VIEWER,
} from './organizationConstants'

const getOrganizationState = (state) =>
    getAdminStateSelector(state).adminOrganization
const getOrganizationData = (state) => getOrganizationState(state).data

export const isOrganizationsLoadedSelector = (state) =>
    getOrganizationState(state).organizationsLoaded
export const getOrganizationsSelector = (state) =>
    getOrganizationData(state).organizations
export const getOrganizationsLoadErrorSelector = (state) =>
    getOrganizationState(state).organizationsLoadError

export const getSelectedOrganizationIdSelector = (state) =>
    getOrganizationState(state).selectedOrganizationId

export const getSelectedOrganizationSelector = createSelector(
    getSelectedOrganizationIdSelector,
    getOrganizationsSelector,
    (selectedOrganizationId, organizations) => {
        if (!organizations || !organizations.length) {
            return null
        }
        return organizations.find(
            (organization) => organization.id === selectedOrganizationId
        )
    }
)

export const getOrganizationOwnerIdSelector = (state) =>
    getSelectedOrganizationSelector(state).ownerUserId
export const getOrganizationMembersIdsSelector = createSelector(
    getSelectedOrganizationSelector,
    (organization) => {
        if (!organization) {
            return []
        }
        // Roles are splitted into separate ids array, so we merge them and always take the highest role for a given user

        const viewerUserIds = organization.viewerUserIds.reduce(
            (acc, userId) => {
                acc[userId] = {
                    userId: userId,
                    role: ORGANIZATION_USER_ROLE_VIEWER,
                }
                return acc
            },
            {}
        )

        const editorViewerUserIds = organization.editorUserIds.reduce(
            (acc, userId) => {
                acc[userId] = {
                    userId: userId,
                    role: ORGANIZATION_USER_ROLE_EDITOR,
                }
                return acc
            },
            viewerUserIds
        )

        const adminEditorViewerUserIds = organization.adminUserIds.reduce(
            (acc, userId) => {
                acc[userId] = {
                    userId: userId,
                    role: ORGANIZATION_USER_ROLE_ADMIN,
                }
                return acc
            },
            editorViewerUserIds
        )

        const allRolesUser = {
            ...adminEditorViewerUserIds,
            [organization.ownerUserId]: {
                userId: organization.ownerUserId,
                role: ORGANIZATION_USER_ROLE_OWNER,
            },
        }

        return Object.values(allRolesUser)
    }
)
