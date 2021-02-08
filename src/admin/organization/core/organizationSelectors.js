import { getAdminStateSelector } from '../../adminSelector'

const getOrganizationState = (state) =>
    getAdminStateSelector(state).adminOrganization
const getOrganizationData = (state) => getOrganizationState(state).data

export const isOrganizationsLoadedSelector = (state) =>
    getOrganizationState(state).organizationsLoaded
export const getOrganizationsSelector = (state) =>
    getOrganizationData(state).organizations
export const getOrganizationsLoadErrorSelector = (state) =>
    getOrganizationState(state).organizationsLoadError
