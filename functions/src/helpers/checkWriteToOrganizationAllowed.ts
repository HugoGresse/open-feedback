import { HttpsError, CallableRequest } from 'firebase-functions/v2/https'
import { assertUserAuthenticated } from './assertUserAuthenticated'
import { getOrganization } from './getOrganization'
import { isOrganizationWriteAllowed } from './isOrganizationWriteAllowed'

export const checkWriteToOrganizationAllowed = async (
    request: CallableRequest,
    organizationId: string
) => {
    const uid = assertUserAuthenticated(request)
    const organization = await getOrganization(organizationId)

    if (isOrganizationWriteAllowed(uid, organization)) {
        return
    }

    throw new HttpsError(
        'permission-denied',
        'Only the organizations members with write rights can edit an organization.'
    )
}
