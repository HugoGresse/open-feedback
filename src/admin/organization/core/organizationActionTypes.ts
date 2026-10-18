import type { Organization } from '../../../core/models'

export const GET_ORGANIZATIONS_SUCCESS = 'admin/organizations/get/success'
export const GET_ORGANIZATIONS_ERROR = 'admin/organizations/get/error'
export const SELECT_ORGANIZATION = 'admin/organization/select'
export const GET_ORGANIZATION_SUCCESS = 'admin/organization/get/success'

export type SelectOrganizationAction = {
    type: typeof SELECT_ORGANIZATION
    payload: string | null
}

export type OrganizationAction =
    | { type: typeof GET_ORGANIZATIONS_SUCCESS; payload: Organization[] }
    | { type: typeof GET_ORGANIZATIONS_ERROR; payload: string }
    | SelectOrganizationAction
    | { type: typeof GET_ORGANIZATION_SUCCESS; payload: Organization }
