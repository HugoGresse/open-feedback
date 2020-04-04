import { analytics } from '../../firebase'

export const trackNewProject = (projectName, setupType) => {
    analytics.logEvent('admin_new_project', {
        name: projectName,
        setup: setupType,
    })
}
