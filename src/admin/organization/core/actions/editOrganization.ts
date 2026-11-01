import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import type { FieldValue, Organization } from '../../../../core/models'
import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import { addNotification } from '../../../notification/notifcationActions'
import { getSelectedOrganizationIdSelector } from '../organizationSelectors'
import { getOrganization } from './getOrganization'

/**
 * Fields merged into the organization document. Any field may also be a
 * Firestore sentinel (arrayUnion/arrayRemove for the role user ids...).
 */
export type EditOrganizationData = {
    [K in keyof Omit<Organization, 'id'>]?: Organization[K] | FieldValue
}

export const editOrganization =
    (organizationData: EditOrganizationData): AppThunk<Promise<void>> =>
    (dispatch, getState) => {
        const state = getState()
        // Only dispatched while an organization is selected.
        const organizationId = getSelectedOrganizationIdSelector(
            state
        ) as string

        return setDoc(
            doc(fireStoreMainInstance, 'organizations', organizationId),
            {
                ...organizationData,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        )
            .then(() => {
                dispatch(
                    addNotification({
                        type: 'success',
                        i18nkey: 'organization.saveSuccess',
                    })
                )

                // Resolved once reloaded, so callers display the saved data
                return dispatch(getOrganization(organizationId)).then(
                    () => undefined
                )
            })
            .catch((err: unknown) => {
                // biome-ignore lint/suspicious/noConsole: intentional log
                console.log(err)
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'organization.saveFail',
                    })
                )
                dispatch(
                    addNotification({
                        type: 'error',
                        message: String(err),
                    })
                )
            })
    }
