import { fireStoreMainInstance, serverTimestamp } from '../../../../firebase'
import { addNotification } from '../../../notification/notifcationActions'
import { getSelectedOrganizationIdSelector } from '../organizationSelectors'
import { getOrganization } from './getOrganization'

export const editOrganization = (organizationData) => (dispatch, getState) => {
    const state = getState()
    const organizationId = getSelectedOrganizationIdSelector(state)

    return fireStoreMainInstance
        .collection('organizations')
        .doc(organizationId)
        .set(
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

            dispatch(getOrganization(organizationId))
        })
        .catch((err) => {
            // eslint-disable-next-line no-console
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
                    message: err.toString(),
                })
            )
        })
}
