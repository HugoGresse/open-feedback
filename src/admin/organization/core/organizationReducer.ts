import type { Organization } from '../../../core/models'
import { LOGOUT, type LogoutAction } from '../../auth/authActionTypes'
import {
    GET_ORGANIZATION_SUCCESS,
    GET_ORGANIZATIONS_ERROR,
    GET_ORGANIZATIONS_SUCCESS,
    type OrganizationAction,
    SELECT_ORGANIZATION,
} from './organizationActionTypes'

export interface OrganizationState {
    data: {
        organizations: Organization[]
    }
    organizationsLoaded: boolean
    organizationsLoadError: string | null
    selectedOrganizationId: string | null
}

const initState: OrganizationState = {
    data: {
        organizations: [],
    },
    organizationsLoaded: false,
    organizationsLoadError: null,
    selectedOrganizationId: null,
}

export const adminOrganizationReducer = (
    state: OrganizationState = initState,
    action: OrganizationAction | LogoutAction
): OrganizationState => {
    switch (action.type) {
        case LOGOUT:
            return initState
        case SELECT_ORGANIZATION:
            return {
                ...state,
                selectedOrganizationId: action.payload,
            }
        case GET_ORGANIZATIONS_SUCCESS:
            return {
                ...state,
                data: {
                    organizations: action.payload,
                },
                organizationsLoaded: true,
            }

        case GET_ORGANIZATIONS_ERROR:
            return {
                ...state,
                organizationsLoadError: action.payload,
            }
        case GET_ORGANIZATION_SUCCESS: {
            const payload = action.payload
            let organizations: Organization[] = []
            if (state.data.organizations.length > 0) {
                organizations = state.data.organizations.map((organization) => {
                    if (organization.id === payload.id) {
                        return {
                            ...payload,
                        }
                    }
                    return organization
                })
            } else {
                organizations.push(payload)
            }

            return {
                ...state,
                data: {
                    ...state.data,
                    organizations,
                },
            }
        }
        default:
            return state
    }
}
