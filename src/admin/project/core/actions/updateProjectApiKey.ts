import type { Dispatch } from 'redux'
import { getSelectedProjectIdSelector } from '../projectSelectors'
import { deleteField, fireStoreMainInstance } from '../../../../firebase.ts'
import { addNotification } from '../../../notification/notifcationActions'
import { generateProjectApiKey } from '../../../../utils/generateApiKey'

// The API key lives in a member-only private subcollection, NOT on the project
// doc (which is world-readable: `allow get: if true` in firestore.rules).
export const PROJECT_PRIVATE_COLLECTION = 'private'
export const PROJECT_INTEGRATION_DOC = 'integration'

export interface ProjectIntegration {
    apiKey?: string
    apiKeyLastUsedAt?: unknown
}

const integrationDocRef = (projectId: string) =>
    fireStoreMainInstance
        .collection('projects')
        .doc(projectId)
        .collection(PROJECT_PRIVATE_COLLECTION)
        .doc(PROJECT_INTEGRATION_DOC)

export const fetchProjectIntegration = async (
    projectId: string
): Promise<ProjectIntegration | null> => {
    const doc = await integrationDocRef(projectId).get()
    return doc.exists ? (doc.data() as ProjectIntegration) : null
}

/**
 * Generate a brand new API key for the selected project (used both for the
 * initial "Generate" and for "Rotate"). Rotating invalidates the previous key,
 * so we also reset the last-used marker. Returns the new key.
 */
export const updateProjectApiKey =
    () =>
    (dispatch: Dispatch, getState: () => unknown): Promise<string | void> => {
        const projectId = getSelectedProjectIdSelector(getState())
        const apiKey = generateProjectApiKey()

        return integrationDocRef(projectId)
            .set({ apiKey, apiKeyLastUsedAt: deleteField() }, { merge: true })
            .then(() => {
                dispatch(
                    addNotification({
                        type: 'success',
                        i18nkey: 'settingsIntegration.keyUpdated',
                    })
                )
                return apiKey
            })
            .catch((err: unknown) => {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'project.saveFail',
                    })
                )
            })
    }
