import { analytics } from '../../firebase'

export const trackVote = (projectName, projectId, voteType) => {
    if (!analytics) return
    analytics.logEvent('vote', {
        project_name: projectName,
        project_id: projectId,
        voteType: voteType,
    })
}

export const trackUnvote = (projectName, projectId) => {
    if (!analytics) return
    analytics.logEvent('unvote', {
        project_name: projectName,
        project_id: projectId,
    })
}
