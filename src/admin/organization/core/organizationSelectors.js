import { getAdminStateSelector } from '../../adminSelector'
import { createSelector } from 'reselect'

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
