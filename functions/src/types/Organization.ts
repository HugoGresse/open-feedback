export interface Organization {
    id: string
    name: string
    ownerUserId: string
    adminUserIds: string[]
    editorUserIds: string[]
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
