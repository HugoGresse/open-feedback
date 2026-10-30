import type { AppThunk } from '../../../../store'
import { functions } from '../../../../firebase.ts'
import { addNotification } from '../../../notification/notifcationActions'
import { DELETE_ORGANIZATION_SUCCESS } from '../organizationActionTypes'
import { unselectOrganization } from './selectUnselectActions'

const getErrorCode = (error: unknown): unknown =>
    typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : undefined

/**
 * Delete an organization through the deleteOrganization function, which only
 * allows its owner, refuses while it still has events and also deletes its API
 * key, invites and images.
 *
 * Resolves to true once deleted.
 */
export const deleteOrganization =
    (organizationId: string): AppThunk<Promise<boolean>> =>
    async (dispatch) => {
        try {
            await functions.deleteOrganization({ organizationId })
        } catch (error: unknown) {
            // biome-ignore lint/suspicious/noConsole: intentional log
            console.error(error)
            // Callable errors codes are prefixed by the "functions/" service
            const code = getErrorCode(error)
            if (code === 'functions/failed-precondition') {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'organization.delete.hasEvents',
                    })
                )
            } else if (code === 'functions/permission-denied') {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'organization.delete.permissionDenied',
                    })
                )
            } else {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'organization.delete.fail',
                        message: String(error),
                    })
                )
            }
            return false
        }

        // Unselected first: the organization page shows a loader, not a 404,
        // until the caller closes it
        await dispatch(unselectOrganization())
        dispatch({
            type: DELETE_ORGANIZATION_SUCCESS,
            payload: organizationId,
        })
        dispatch(
            addNotification({
                type: 'success',
                i18nkey: 'organization.delete.success',
            })
        )
        return true
    }
