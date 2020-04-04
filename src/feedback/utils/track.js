import { analytics } from '../../firebase'

export const trackVote = (projectName, projectId, voteType) => {
    analytics.logEvent('vote', {
        project_name: projectName,
        project_id: projectId,
        voteType: voteType,
    })
}

export const trackUnvote = (projectName, projectId) => {
    analytics.logEvent('unvote', {
        project_name: projectName,
        project_id: projectId,
    })
}
