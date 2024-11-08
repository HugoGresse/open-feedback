import { newId } from '../../../../utils/stringUtils'
import firebase from 'firebase/compat/app'
import 'firebase/storage'
import { getStoragePublicPath, isUsingEmulators } from '../../../../firebase.ts'
import { getSelectedProjectIdSelector } from '../../core/projectSelectors'
import { getSelectedOrganizationIdSelector } from '../../../organization/core/organizationSelectors'
import { resizeImage } from '../../../../utils/resizeImage.js'

export const uploadImage =
    (file, width = 500) =>
    async (dispatch, getState) => {
        const state = getState()
        const projectId = getSelectedProjectIdSelector(state)
        const organizationId = getSelectedOrganizationIdSelector(state)

        const folderName = projectId ? 'projects' : 'organizations'
        const fileFolderId = projectId ? projectId : organizationId
        const docProjectId = projectId ? { projectId } : { organizationId }

        const resizedImage = await resizeImage(file, width)

        const storageRef = firebase.storage().ref()
        const pathRef = storageRef.child(`${folderName}/${fileFolderId}/`)

        const uploadRef = pathRef.child(`${newId()}_${file.name}`)

        return await uploadRef
            .put(resizedImage, docProjectId)
            .then(async (snapshot) => {
                if (isUsingEmulators) {
                    return await snapshot.ref.getDownloadURL()
                }

                return await getStoragePublicPath(snapshot.ref)
            })
    }
