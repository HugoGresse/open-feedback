import { analytics } from '../../firebase.ts'

export const trackVote = (
    projectName: string,
    projectId: string,
    voteType: string
) => {
    if (!analytics) return
    analytics.logEvent('vote', {
        project_name: projectName,
        project_id: projectId,
        voteType: voteType,
    })
}

export const trackUnvote = (projectName: string, projectId: string) => {
    if (!analytics) return
    analytics.logEvent('unvote', {
        project_name: projectName,
        project_id: projectId,
    })
}
