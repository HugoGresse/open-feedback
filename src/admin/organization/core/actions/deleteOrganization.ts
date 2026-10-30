import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import { addNotification } from '../../../notification/notifcationActions'
import { DELETE_ORGANIZATION_SUCCESS } from '../organizationActionTypes'
import { ORGANIZATION_PRIVATE_COLLECTION } from './updateOrganizationApiKey'

/**
 * Delete an organization, its private docs (API key) and its invites, in one
 * batch. Refused while the organization still has events: they must be deleted
 * (or moved) first, so no event is ever left pointing to a missing
 * organization. Only the owner is allowed to do this by the Firestore rules.
 *
 * Resolves to true once deleted.
 */
export const deleteOrganization =
    (organizationId: string): AppThunk<Promise<boolean>> =>
    async (dispatch) => {
        const organizationRef = fireStoreMainInstance
            .collection('organizations')
            .doc(organizationId)

        try {
            const projects = await fireStoreMainInstance
                .collection('projects')
                .where('organizationId', '==', organizationId)
                .limit(1)
                .get()
            if (!projects.empty) {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'organization.delete.hasEvents',
                    })
                )
                return false
            }

            const [privateDocs, invites] = await Promise.all([
                organizationRef
                    .collection(ORGANIZATION_PRIVATE_COLLECTION)
                    .get(),
                fireStoreMainInstance
                    .collection('invites')
                    .where('organizationId', '==', organizationId)
                    .get(),
            ])

            const batch = fireStoreMainInstance.batch()
            privateDocs.forEach((doc) => batch.delete(doc.ref))
            invites.forEach((doc) => batch.delete(doc.ref))
            batch.delete(organizationRef)
            await batch.commit()
        } catch (err: unknown) {
            // biome-ignore lint/suspicious/noConsole: intentional log
            console.error(err)
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'organization.delete.fail',
                    message: String(err),
                })
            )
            return false
        }

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
