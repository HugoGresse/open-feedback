import { newId } from '../../../../utils/stringUtils'
import firebase from 'firebase/app'
import 'firebase/storage'
import { functions } from '../../../../firebase'
import { getUserSelector } from '../../../auth/authSelectors'
import { getSelectedProjectIdSelector } from '../../core/projectSelectors'
import { addNotification } from '../../../notification/notifcationActions'

export const uploadImage = file => async (dispatch, getState) => {
    const userId = getUserSelector(getState()).uid
    const projectId = getSelectedProjectIdSelector(getState())

    const storageRef = firebase.storage().ref()

    const pathRef = storageRef.child(`users/${userId}/`)

    const metadata = {
        projectId: projectId,
    }

    const storageFullPath = await pathRef
        .child(`${newId()}_${file.name}`)
        .put(file, metadata)
        .then(async snapshot => snapshot.ref.fullPath)

    try {
        const result = await functions.resizeAndMoveImage({
            projectId,
            storageFullPath,
            width: 500,
            height: 500,
        })

        return result.data
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        dispatch(
            addNotification({
                type: 'error',
                message: error.message,
            })
        )
    }
}
