import { LOGOUT } from '../../auth/authActionTypes'
import {
    GET_ORGANIZATION_SUCCESS,
    GET_ORGANIZATIONS_ERROR,
    GET_ORGANIZATIONS_SUCCESS,
    SELECT_ORGANIZATION,
} from './organizationActionTypes'

const initState = {
    data: {
        organizations: [],
    },
    organizationsLoaded: false,
    organizationsLoadError: null,
    selectedOrganizationId: null,
}

export const adminOrganizationReducer = (
    state = initState,
    { payload, type }
) => {
    switch (type) {
        case LOGOUT:
            return initState
        case SELECT_ORGANIZATION:
            return {
                ...state,
                selectedOrganizationId: payload,
            }
        case GET_ORGANIZATIONS_SUCCESS:
            return {
                ...state,
                data: {
                    organizations: payload,
                },
                organizationsLoaded: true,
            }

        case GET_ORGANIZATIONS_ERROR:
            return {
                ...state,
                organizationsLoadError: payload,
            }
        case GET_ORGANIZATION_SUCCESS: {
            const organizations = state.data.organizations.map(
                (organization) => {
                    if (organization.id === state.selectedOrganizationId) {
                        return {
                            ...payload,
                        }
                    }
                    return organization
                }
            )

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
