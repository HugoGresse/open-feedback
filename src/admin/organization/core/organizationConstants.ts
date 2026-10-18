import type { Organization } from '../../../core/models'

export const NO_ORGANIZATION_FAKE_ID = 'NO_ORGANIZATION_FAKE_ID' // This is not in database, only to manipulate personnal project

export const ORGANIZATION_USER_ROLE_EDITOR = 'Editor'
export const ORGANIZATION_USER_ROLE_VIEWER = 'Viewer'
export const ORGANIZATION_USER_ROLE_ADMIN = 'Admin'
export const ORGANIZATION_USER_ROLE_OWNER = 'Owner'

export type OrganizationUserRole =
    | typeof ORGANIZATION_USER_ROLE_EDITOR
    | typeof ORGANIZATION_USER_ROLE_VIEWER
    | typeof ORGANIZATION_USER_ROLE_ADMIN
    | typeof ORGANIZATION_USER_ROLE_OWNER

/** Organization document fields holding the user ids of each role. */
export type OrganizationRoleField = keyof Pick<
    Organization,
    'ownerUserId' | 'adminUserIds' | 'editorUserIds' | 'viewerUserIds'
>

export const ORGANIZATION_ROLE_ID = {
    [ORGANIZATION_USER_ROLE_OWNER]: 'ownerUserId',
    [ORGANIZATION_USER_ROLE_ADMIN]: 'adminUserIds',
    [ORGANIZATION_USER_ROLE_EDITOR]: 'editorUserIds',
    [ORGANIZATION_USER_ROLE_VIEWER]: 'viewerUserIds',
} as const satisfies Record<OrganizationUserRole, OrganizationRoleField>

export const ORGANIZATION_NEW_USER_ROLES: OrganizationUserRole[] = [
    ORGANIZATION_USER_ROLE_VIEWER,
    ORGANIZATION_USER_ROLE_EDITOR,
    ORGANIZATION_USER_ROLE_ADMIN,
]

export const ORGANIZATION_EXISTING_USER_ROLES: OrganizationUserRole[] = [
    ...ORGANIZATION_NEW_USER_ROLES,
    ORGANIZATION_USER_ROLE_OWNER,
]
