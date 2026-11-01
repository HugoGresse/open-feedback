import { logEvent } from 'firebase/analytics'
import { analytics } from '../../firebase.ts'

export const trackVote = (
    projectName: string,
    projectId: string,
    voteType: string
) => {
    if (!analytics) return
    logEvent(analytics, 'vote', {
        project_name: projectName,
        project_id: projectId,
        voteType: voteType,
    })
}

export const trackUnvote = (projectName: string, projectId: string) => {
    if (!analytics) return
    logEvent(analytics, 'unvote', {
        project_name: projectName,
        project_id: projectId,
    })
}
