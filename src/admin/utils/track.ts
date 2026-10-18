import { analytics } from '../../firebase.ts'

export const trackNewProject = (projectName, setupType, organizationId) => {
    if (!analytics) return
    analytics.logEvent('admin_new_project', {
        name: projectName,
        setup: setupType,
        organizationId: organizationId,
    })
}

export const trackNewOrganization = (organizationName) => {
    if (!analytics) return
    analytics.logEvent('admin_new_organization', {
        name: organizationName,
    })
}
