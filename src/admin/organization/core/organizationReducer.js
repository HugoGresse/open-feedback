import { LOGOUT } from '../../auth/authActionTypes'
import {
    GET_ORGANIZATIONS_ERROR,
    GET_ORGANIZATIONS_SUCCESS,
} from './organizationActionTypes'

const initState = {
    data: {
        organizations: [],
    },
    organizationsLoaded: false,
    organizationsLoadError: null,
}

export const adminOrganizationReducer = (
    state = initState,
    { payload, type }
) => {
    // TODO : display organization in home page + button to "Show more" if more than 6
    switch (type) {
        case LOGOUT:
            return initState
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
