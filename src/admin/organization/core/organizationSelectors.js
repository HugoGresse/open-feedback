import { getAdminStateSelector } from '../../adminSelector'

const getOrganizationState = (state) =>
    getAdminStateSelector(state).adminOrganization

export const isOrganizationsLoadedSelector = (state) =>
    getOrganizationState(state).organizationsLoaded
export const getOrganizationsLoadErrorSelector = (state) =>
    getOrganizationState(state).organizationsLoadError
