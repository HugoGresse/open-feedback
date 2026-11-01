import { newId } from '../../../../utils/stringUtils'
import { ref, uploadBytes } from 'firebase/storage'
import { getStoragePublicPath, storage } from './firebaseStorage.ts'
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

        const storageRef = ref(storage)
        const pathRef = ref(storageRef, `${folderName}/${fileFolderId}/`)

        const uploadRef = ref(pathRef, `${newId()}_${file.name}`)

        // The untyped code passed `{ projectId }` / `{ organizationId }` as
        // metadata: not UploadMetadata fields, so the SDK dropped them.
        return await uploadBytes(uploadRef, resizedImage).then((snapshot) =>
            getStoragePublicPath(snapshot.ref)
        )
    }
