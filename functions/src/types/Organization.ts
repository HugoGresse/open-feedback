import { User } from './User'

export interface Organization {
    id: string
    name: string
    ownerUserId: string
    adminUserIds: string[]
    editorUserIds: string[]
    viewerUserIds?: string[]
    favicon?: string
    logoSmall?: string
    languages?: string[]
    disableSoloTalkRedirect?: boolean
    hideVotesUntilUserVote?: boolean
    chipColors?: string[]
    createdAt?: string
    updatedAt?: string
}

export interface OrganizationDBEntity {
    id: string
    name: string
    ownerUserId: string
    adminUserIds: string[]
    editorUserIds: string[]
    viewerUserIds: string[]
    disableSoloTalkRedirect: boolean
    hideVotesUntilUserVote: boolean
    chipColors: string[]
    createdAt: string
    updatedAt: string
    favicon: string
    logoSmall: string
    languages: string[]
    apiKey: string
}

export interface HydratedOrganization
    extends Omit<
        Organization,
        'ownerUserId' | 'adminUserIds' | 'editorUserIds' | 'viewerUserIds'
    > {
    ownerUser: User
    adminUsers: User[]
    editorUsers: User[]
    viewerUsers: User[]
}
