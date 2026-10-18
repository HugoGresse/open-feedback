import type { AppThunk } from '../../../../store'
import { SELECT_ORGANIZATION } from '../organizationActionTypes'
import { getSelectedOrganizationIdSelector } from '../organizationSelectors'

export const unselectOrganization =
    (): AppThunk<Promise<void>> => (dispatch, getState) => {
        const organizationId = getSelectedOrganizationIdSelector(getState())

        if (!organizationId) {
            return Promise.resolve()
        }

        dispatch({
            type: SELECT_ORGANIZATION,
            payload: null,
        })
        return Promise.resolve()
    }

/**
 * Resolves `true` when the organization was already selected.
 */
export const selectOrganization =
    (organizationId: string): AppThunk<Promise<boolean>> =>
    (dispatch, getState) => {
        const currentSelectedOrganizationId =
            getSelectedOrganizationIdSelector(getState())
        if (currentSelectedOrganizationId === organizationId) {
            // Organization already selected (HMR potentially)
            return Promise.resolve(true)
        }

        dispatch({
            type: SELECT_ORGANIZATION,
            payload: organizationId,
        })

        return Promise.resolve(false)
    }
