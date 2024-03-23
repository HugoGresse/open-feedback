import { newId } from '../../../../utils/stringUtils'
import firebase from 'firebase/compat/app'
import 'firebase/storage'
import { functions } from '../../../../firebase'
import { getUserSelector } from '../../../auth/authSelectors'
import { getSelectedProjectIdSelector } from '../../core/projectSelectors'
import { addNotification } from '../../../notification/notifcationActions'
import { getSelectedOrganizationIdSelector } from '../../../organization/core/organizationSelectors'

export const uploadImage =
    (file, width = 500, height = 500) =>
    async (dispatch, getState) => {
        const state = getState()
        const userId = getUserSelector(state).uid
        const projectId = getSelectedProjectIdSelector(state)
        const organizationId = getSelectedOrganizationIdSelector(state)

        const docId = projectId ? { projectId } : { organizationId }

        const storageRef = firebase.storage().ref()

        const pathRef = storageRef.child(`users/${userId}/`)

        const storageFullPath = await pathRef
            .child(`${newId()}_${file.name}`)
            .put(file, docId)
            .then(async (snapshot) => snapshot.ref.fullPath)

        const result = await functions
            .resizeAndMoveImage({
                ...docId,
                storageFullPath,
                width,
                height,
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error)
                dispatch(
                    addNotification({
                        type: 'error',
                        message: error.message,
                    })
                )
            })

        if (result) {
            return result.data
        }
    }
