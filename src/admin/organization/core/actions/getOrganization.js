import { fireStoreMainInstance } from '../../../../firebase.ts'
import {
    GET_ORGANIZATION_SUCCESS,
    GET_ORGANIZATIONS_ERROR,
} from '../organizationActionTypes'
import { addNotification } from '../../../notification/notifcationActions'

export const getOrganization = (organizationId) => (dispatch) => {
    return fireStoreMainInstance
        .collection('organizations')
        .doc(organizationId)
        .get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                const data = {
                    id: organizationId,
                    ...docSnapshot.data(),
                }
                dispatch({
                    type: GET_ORGANIZATION_SUCCESS,
                    payload: data,
                })
                return data
            } else {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'organization.errorsLoadOrganizations',
                    })
                )
            }
        })
        .catch((err) => {
            dispatch({
                type: GET_ORGANIZATIONS_ERROR,
                payload: err.toString(),
            })
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'organization.errorsLoadOrganizations',
                })
            )
        })
}
