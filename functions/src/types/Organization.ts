export interface Organization {
    id: string
    name: string
    ownerUserId: string
    adminUserIds: string[]
    editorUserIds: string[]
}
