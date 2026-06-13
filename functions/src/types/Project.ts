export interface Project {
    id: string
    name: string
    owner: string
    members: string[]
    organizationId?: string
}

/**
 * Member-only integration data for a project, stored in the private subcollection
 * `projects/{projectId}/private/integration` (NOT on the world-readable project
 * doc). The API auth layer resolves a key to its project and stamps
 * `apiKeyLastUsedAt` (ISO 8601 string) on use.
 */
export interface ProjectIntegration {
    apiKey: string
    apiKeyLastUsedAt?: string
}
