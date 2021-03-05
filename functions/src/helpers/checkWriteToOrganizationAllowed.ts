import * as functions from 'firebase-functions'
import { CallableContext } from 'firebase-functions/lib/providers/https'
import { assertUserAuthenticated } from './assertUserAuthenticated'
import { getOrganization } from './getOrganization'
import { isOrganizationWriteAllowed } from './isOrganizationWriteAllowed'

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
