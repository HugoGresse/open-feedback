import admin from 'firebase-admin'
import send from '../../email/send'
import { isEmpty } from 'lodash'
import { getAppEnv, getMailgunEnv } from '../../helpers/env'
import { generateInviteEmail } from './generateInviteEmail'
import { applyInvites, markInviteAsErrored } from './applyInvites'
import { getInviteTarget } from './getInviteTarget'
import { InvitationType } from '../../types/InvitationType'
import type { EmailInvite } from '../../types/EmailInvite'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'

// userInviteCreated is called when an user as been invited to a project or an organization.
// An email is sent to him with the invitation link.
// To test (config comes from functions/.env* via process.env, not the
// deprecated functions.config()):
// > firebase functions:shell
// - for event/project
// > userInviteCreated({projectId: "", projectName: "", originUserName: "", destinationUserInfo: ""})
// - for organization
// > userInviteCreated({organizationId: "", organizationName: "", originUserName: "", destinationUserInfo: ""})
export const userInviteCreated = onDocumentCreated(
    '/invites/{inviteId}',
    async (event) => {
        const snapshot = event.data
        if (!snapshot) {
            return
        }
        const appEnv = getAppEnv()
        const mailgunEnv = getMailgunEnv()
        const inviteId = snapshot.id
        const data = snapshot.data()

        if (!data || isEmpty(data)) {
            return Promise.reject(new Error('Empty data'))
        }

        const target = getInviteTarget(data)
        if (!target) {
            console.error('> userInviteCreated invalid invite', inviteId)
            return markInviteAsErrored(inviteId, INVALID_TARGET_ERROR)
        }

        const baseInvite = {
            destinationUserInfo: data.destinationUserInfo,
            originUserName: data.originUserName,
        }
        const invite: EmailInvite =
            target.type === InvitationType.OrganizationInvitationType
                ? {
                      ...baseInvite,
                      type: InvitationType.OrganizationInvitationType,
                      organizationId: target.id,
                      organizationName: data.organizationName,
                  }
                : {
                      ...baseInvite,
                      type: InvitationType.ProjectInvitationType,
                      projectId: target.id,
                      projectName: data.projectName,
                  }

        const sendResult = await send(
            mailgunEnv,
            generateInviteEmail(invite, data.lang || 'en', appEnv, inviteId)
        )

        if (!sendResult.ok) {
            return Promise.reject(
                'Function failed due to not successful email send'
            )
        }

        await admin.firestore().collection('invites').doc(inviteId).update({
            status: 'emailSent',
        })

        // Look the invitee up in Firebase Auth: the users collection is
        // written by its owners, so its email field can claim any address.
        const user = await getAuthUserByEmail(data.destinationUserInfo)
        if (!user) {
            return 'no user matched'
        }
        return checkPendingInviteAndProcessThem(user)
    }
)

const INVALID_TARGET_ERROR = 'Invalid invite target'

const getAuthUserByEmail = async (
    email: string
): Promise<admin.auth.UserRecord | null> => {
    try {
        return await admin.auth().getUserByEmail(email)
    } catch (error) {
        if ((error as { code?: string })?.code === 'auth/user-not-found') {
            return null
        }
        throw error
    }
}

// From a given user, check if they have pending invites, if so add them to the
// linked project or organization and complete each invite.
export const checkPendingInviteAndProcessThem = async (
    user: admin.auth.UserRecord
) => {
    // Anyone can create an email/password account for an address they do not
    // own: invites wait for the email to be verified (see userEmailVerified).
    if (user.email && !user.emailVerified) {
        return 'email not verified'
    }
    const querySnapshot = await admin
        .firestore()
        .collection('invites')
        .where('destinationUserInfo', '==', user.email || user.phoneNumber)
        .where('status', '==', 'emailSent')
        .get()

    const promises: Promise<FirebaseFirestore.WriteResult>[] = []
    querySnapshot.forEach((snapshot) => {
        const target = getInviteTarget(snapshot.data())
        promises.push(
            target
                ? applyInvites(
                      snapshot.id,
                      target.type,
                      user.uid,
                      target.id,
                      target.role
                  )
                : markInviteAsErrored(snapshot.id, INVALID_TARGET_ERROR)
        )
    })
    return Promise.all(promises)
}
