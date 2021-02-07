import { fireStoreMainInstance, serverTimestamp } from '../../../../firebase'
import { addNotification } from '../../../notification/notifcationActions'
import { trackNewOrganization } from '../../../utils/track'
import { getUserSelector } from '../../../auth/authSelectors'

export const newOrganization = (name) => async (dispatch, getState) => {
    const userId = getUserSelector(getState()).uid

    const orgData = {
        name: name,
        ownerUserId: userId,
        adminUserIds: [userId],
        editorUserIds: [userId],
        viewerUserIds: [userId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    }

    return fireStoreMainInstance
        .collection('organizations')
        .add(orgData)
        .then((documentRef) => {
            console.log(documentRef.id)
            dispatch(
                addNotification({
                    type: 'success',
                    i18nkey: 'organization.newSuccess',
                })
            )
            // dispatch({
            //     type: ADD_PROJECT_SUCCESS,
            //     payload: projectId,
            // })
            trackNewOrganization(orgData.name)
            return documentRef.id
        })
        .catch((err) => {
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'organization.newFail',
                    message: err.toString(),
                })
            )
        })
}
