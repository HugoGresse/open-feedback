import { newId } from '../../../../utils/stringUtils'
import firebase from 'firebase/compat/app'
import 'firebase/storage'
import { getStoragePublicPath, isUsingEmulators } from '../../../../firebase.ts'
import { getSelectedProjectIdSelector } from '../../core/projectSelectors'
import { getSelectedOrganizationIdSelector } from '../../../organization/core/organizationSelectors'
import { resizeImage } from '../../../../utils/resizeImage.ts'
import type { AppThunk } from '../../../../store'

export const uploadImage =
    (file: File, width = 500): AppThunk<Promise<string>> =>
    async (_dispatch, getState) => {
        const state = getState()
        const projectId = getSelectedProjectIdSelector(state)
        const organizationId: string | null =
            getSelectedOrganizationIdSelector(state)

        const folderName = projectId ? 'projects' : 'organizations'
        const fileFolderId = projectId ? projectId : organizationId

        const resizedImage = await resizeImage(file, width)

        const storageRef = firebase.storage().ref()
        const pathRef = storageRef.child(`${folderName}/${fileFolderId}/`)

        const uploadRef = pathRef.child(`${newId()}_${file.name}`)

        return await uploadRef
            // The untyped code passed `{ projectId }` / `{ organizationId }` as
            // metadata: not UploadMetadata fields, so the SDK dropped them.
            .put(resizedImage)
            .then(async (snapshot) => {
                if (isUsingEmulators) {
                    return await snapshot.ref.getDownloadURL()
                }

                return await getStoragePublicPath(snapshot.ref)
            })
    }
