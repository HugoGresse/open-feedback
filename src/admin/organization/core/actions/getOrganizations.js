import { fireStoreMainInstance } from '../../../../firebase'
import { getUserSelector } from '../../../auth/authSelectors'
import {
    GET_ORGANIZATIONS_ERROR,
    GET_ORGANIZATIONS_SUCCESS,
} from '../organizationActionTypes'
import { addNotification } from '../../../notification/notifcationActions'

const ORGANIZATION_ROLE_ID = {
    owner: 'owner',
    admin: 'admin',
    editor: 'editor',
    viewer: 'viewerUserIds',
}

export const getOrganizations = () => (dispatch, getState) => {
    const user = getUserSelector(getState())

    if (!user) {
        return
    }

    return fireStoreMainInstance
        .collection('organizations')
        .where(ORGANIZATION_ROLE_ID.viewer, 'array-contains', user.uid)
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
            const organizations = []
            querySnapshot.forEach((doc) => {
                organizations.push({
                    id: doc.id,
                    ...doc.data(),
                })
            })

            dispatch({
                type: GET_ORGANIZATIONS_SUCCESS,
                payload: organizations,
            })
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
