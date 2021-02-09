import { LOGOUT } from '../../auth/authActionTypes'
import {
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
    // TODO : display organization in home page + button to "Show more" if more than 6
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

        default:
            return state
    }
}
