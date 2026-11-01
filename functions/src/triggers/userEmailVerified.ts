import admin from 'firebase-admin'
import { onDocumentWritten } from 'firebase-functions/v2/firestore'
import { checkPendingInviteAndProcessThem } from './invites/userInvite'

// Invites wait for a verified email. The admin app writes emailVerified on the
// user doc at the first sign-in after verification; users write their own
// doc, so the Firebase Auth record is what decides.
export const userEmailVerified = onDocumentWritten(
    'users/{userId}',
    async (event) => {
        const before = event.data?.before.data()
        const after = event.data?.after.data()
        if (!after?.emailVerified || before?.emailVerified) {
            return 'email not newly verified'
        }
        const user = await admin.auth().getUser(event.params.userId)
        return checkPendingInviteAndProcessThem(user)
    }
)
