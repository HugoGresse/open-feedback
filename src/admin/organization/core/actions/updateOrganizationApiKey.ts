import type { Dispatch } from 'redux'
import { getSelectedOrganizationIdSelector } from '../organizationSelectors'
import { deleteField, fireStoreMainInstance } from '../../../../firebase.ts'
import { addNotification } from '../../../notification/notifcationActions'
import { generateOrgApiKey } from '../../../../utils/generateApiKey'

// The API key lives in a member-only private subcollection, NOT on the
// organization doc (which org viewers can read). Mirrors the event integration.
export const ORGANIZATION_PRIVATE_COLLECTION = 'private'
export const ORGANIZATION_INTEGRATION_DOC = 'integration'

export interface OrganizationIntegration {
    apiKey?: string
    apiKeyLastUsedAt?: unknown
}

const integrationDocRef = (organizationId: string) =>
    fireStoreMainInstance
        .collection('organizations')
        .doc(organizationId)
        .collection(ORGANIZATION_PRIVATE_COLLECTION)
        .doc(ORGANIZATION_INTEGRATION_DOC)

export const fetchOrganizationIntegration = async (
    organizationId: string
): Promise<OrganizationIntegration | null> => {
    const doc = await integrationDocRef(organizationId).get()
    return doc.exists ? (doc.data() as OrganizationIntegration) : null
}

/**
 * Generate a brand new API key for the selected organization (used both for the
 * initial "Generate" and for "Rotate"). Rotating invalidates the previous key,
 * so we also reset the last-used marker. Returns the new key.
 */
export const updateOrganizationApiKey =
    () =>
    (dispatch: Dispatch, getState: () => unknown): Promise<string | void> => {
        const organizationId = getSelectedOrganizationIdSelector(getState())
        const apiKey = generateOrgApiKey()

        return integrationDocRef(organizationId)
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
            .catch(() => {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'organization.saveFail',
                    })
                )
            })
    }
