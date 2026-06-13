export interface Project {
    id: string
    name: string
    owner: string
    members: string[]
    organizationId?: string
    // API key granting access to this event through the public API.
    apiKey?: string
    // Last time the API key was used to authenticate a request (ISO string or
    // Firestore Timestamp). Written by the API auth layer when a key is used.
    apiKeyLastUsedAt?: string
}
