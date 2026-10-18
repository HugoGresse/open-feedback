import type { RootState } from '../../../store'
import { createAppSelector } from '../../../store'
import { getAdminStateSelector } from '../../adminSelector'
import {
    ORGANIZATION_USER_ROLE_ADMIN,
    ORGANIZATION_USER_ROLE_EDITOR,
    ORGANIZATION_USER_ROLE_OWNER,
    ORGANIZATION_USER_ROLE_VIEWER,
    type OrganizationUserRole,
} from './organizationConstants'
import { getUserIdSelector } from '../../auth/authSelectors'

/** A member of the selected organization with its highest role. */
export interface OrganizationMember {
    userId: string
    role: OrganizationUserRole
}

const getOrganizationState = (state: RootState) =>
    getAdminStateSelector(state).adminOrganization
const getOrganizationData = (state: RootState) =>
    getOrganizationState(state).data

export const isOrganizationsLoadedSelector = (state: RootState) =>
    getOrganizationState(state).organizationsLoaded
export const getOrganizationsSelector = (state: RootState) =>
    getOrganizationData(state).organizations

export const getSelectedOrganizationIdSelector = (state: RootState) =>
    getOrganizationState(state).selectedOrganizationId

// Memoized selectors

/**
 * `null` when no organization is loaded, `undefined` when the selected id is
 * not among the loaded organizations.
 */
export const getSelectedOrganizationSelector = createAppSelector(
    [getSelectedOrganizationIdSelector, getOrganizationsSelector],
    (selectedOrganizationId, organizations) => {
        if (!organizations || !organizations.length) {
            return null
        }
        return organizations.find(
            (organization) => organization.id === selectedOrganizationId
        )
    }
)

// The selectors below are only used while an organization is selected and
// loaded (like the untyped code, they throw otherwise).
const getLoadedSelectedOrganization = (state: RootState) => {
    const organization = getSelectedOrganizationSelector(state)
    if (!organization) {
        throw new TypeError('No selected organization loaded')
    }
    return organization
}

export const getOrganizationOwnerIdSelector = (state: RootState) =>
    getLoadedSelectedOrganization(state).ownerUserId
export const getOrganizationLanguagesSelector = (state: RootState) =>
    getLoadedSelectedOrganization(state).languages || []
export const disableSoloTalkRedirectSelector = (state: RootState) =>
    getLoadedSelectedOrganization(state).disableSoloTalkRedirect || false
export const hideVotesUntilUserVoteSelector = (state: RootState) =>
    getLoadedSelectedOrganization(state).hideVotesUntilUserVote || false
export const displayFullEventDatesSelector = (state: RootState) =>
    getLoadedSelectedOrganization(state).displayFullDates || false

export const isOrganizationRightAllowed = createAppSelector(
    [getLoadedSelectedOrganization, getUserIdSelector],
    (organization, userId) => {
        return (
            organization.ownerUserId === userId ||
            (organization.adminUserIds || []).includes(userId)
        )
    }
)

export const getOrganizationMembersSelector = createAppSelector(
    [getSelectedOrganizationSelector],
    (organization): OrganizationMember[] => {
        if (!organization) {
            return []
        }
        // Roles are splitted into separate ids array, so we merge them and always take the highest role for a given user

        const viewerUserIds = organization.viewerUserIds.reduce<
            Record<string, OrganizationMember>
        >((acc, userId) => {
            acc[userId] = {
                userId: userId,
                role: ORGANIZATION_USER_ROLE_VIEWER,
            }
            return acc
        }, {})

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

        const allRolesUser: Record<string, OrganizationMember> = {
            ...adminEditorViewerUserIds,
            [organization.ownerUserId]: {
                userId: organization.ownerUserId,
                role: ORGANIZATION_USER_ROLE_OWNER,
            },
        }

        return Object.values(allRolesUser)
    }
)

export const getOrganizationMembersIdsSelector = createAppSelector(
    [getOrganizationMembersSelector],
    (members) => members.map((member) => member.userId)
)
