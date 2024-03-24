import * as functions from 'firebase-functions'
import { assertUserAuthenticated } from './assertUserAuthenticated'
import { getOrganization } from './getOrganization'
import { isOrganizationWriteAllowed } from './isOrganizationWriteAllowed'
import { CallableContext } from 'firebase-functions/lib/common/providers/https'

export const checkWriteToOrganizationAllowed = async (
    context: CallableContext,
    organizationId: string
) => {
    const uid = assertUserAuthenticated(context)
    const organization = await getOrganization(organizationId)

    if (isOrganizationWriteAllowed(uid, organization)) {
        return
    }

    throw new functions.https.HttpsError(
        'permission-denied',
        'Only the organizations members with write rights can edit an organization.'
    )
}
