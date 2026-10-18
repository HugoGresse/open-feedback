import type { Project as ProjectDocument, Timestamp } from '../core/models'

export type Project = Pick<
    ProjectDocument,
    'id' | 'name' | 'owner' | 'setupType' | 'organizationId' | 'config'
> & {
    createdAt: Timestamp
    voteStartTime?: string
}

export type ProjectExtraInfo = {
    dateCreated: string
    dateVote: string
    voteCount: number
    speakerCount: number
    link: string
}
