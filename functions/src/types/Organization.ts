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
    /**
     * @deprecated The API key now lives in the member-only private subcollection
     * `organizations/{orgId}/private/integration` (see OrganizationIntegration),
     * never on the org doc. Kept only for backward reads of legacy data.
     */
    apiKey?: string
}

/**
 * Member-only integration data for an organization, stored in the private
 * subcollection `organizations/{orgId}/private/integration` (NOT on the org
 * doc). The API auth layer resolves a key to its organization and stamps
 * `apiKeyLastUsedAt` (ISO 8601 string) on use. Mirrors ProjectIntegration.
 */
export interface OrganizationIntegration {
    apiKey: string
    apiKeyLastUsedAt?: string
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
