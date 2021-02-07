import { analytics } from '../../firebase'

export const trackNewProject = (projectName, setupType) => {
    if (!analytics) return
    analytics.logEvent('admin_new_project', {
        name: projectName,
        setup: setupType,
    })
}

export const trackNewOrganization = (organizationName) => {
    if (!analytics) return
    analytics.logEvent('admin_new_organization', {
        name: organizationName,
    })
}
