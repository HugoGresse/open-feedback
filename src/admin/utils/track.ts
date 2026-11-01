import { logEvent } from 'firebase/analytics'
import { analytics } from '../../firebase.ts'

export const trackNewProject = (
    projectName: string,
    setupType: string,
    organizationId: string | null | undefined
) => {
    if (!analytics) return
    logEvent(analytics, 'admin_new_project', {
        name: projectName,
        setup: setupType,
        organizationId: organizationId,
    })
}

export const trackNewOrganization = (organizationName: string) => {
    if (!analytics) return
    logEvent(analytics, 'admin_new_organization', {
        name: organizationName,
    })
}
