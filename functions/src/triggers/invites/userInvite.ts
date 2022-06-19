import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import send from '../../email/send'
import { isEmpty } from 'lodash'
import { Response } from 'node-fetch'
import { getAppEnv, getMailgunEnv } from '../../helpers/env'
import { generateInviteEmail } from './generateInviteEmail'
import { applyInvites } from './applyInvites'
import { InvitationType } from '../../types/InvitationType'
import { EmailInvite } from '../../types/EmailInvite'

// userInviteCreated is called when an user as been invited to a project or an organization.
// An email is sent to him with the invitation link.
// To test
// > firebase functions:config:get > .runtimeconfig.json
// > firebase functions:shell
// - for event/project
// > userInviteCreated({projectId: "", projectName: "", originUserName: "", destinationUserInfo: ""})
// - for organization
// > userInviteCreated({organizationId: "", organizationName: "", originUserName: "", destinationUserInfo: ""})
export const userInviteCreated = functions.firestore
    .document('/invites/{inviteId}')
    .onCreate(async (snapshot) => {
        const appEnv = getAppEnv()
        const mailgunEnv = getMailgunEnv()
        const inviteId = snapshot.id
        const data = snapshot.data()

        if (!data || isEmpty(data)) {
            return Promise.reject(new Error('Empty data'))
        }

        const baseInvite = {
            destinationUserInfo: data.destinationUserInfo,
            originUserName: data.originUserName,
        }
        const invite: EmailInvite = data.organizationId
            ? {
                  ...baseInvite,
                  type: InvitationType.OrganizationInvitationType,
                  organizationId: data.organizationId,
                  organizationName: data.organizationName,
              }
            : {
                  ...baseInvite,
                  type: InvitationType.ProjectInvitationType,
                  projectId: data.projectId,
                  projectName: data.projectName,
              }

        const sendResult = await send(
            mailgunEnv,
            generateInviteEmail(invite, data.lang || 'en', appEnv, inviteId)
        )

        if (sendResult instanceof Response && sendResult.ok) {
            return admin
                .firestore()
                .collection('invites')
                .doc(inviteId)
                .update({
                    status: 'emailSent',
                })
                .then(() => {
                    return admin
                        .firestore()
                        .collection('users')
                        .where('email', '==', data.destinationUserInfo)
                        .limit(1)
                        .get()
                        .then((querySnapshot) => {
                            if (querySnapshot.empty) {
                                return Promise.resolve('no user matched')
                            }
                            let promise: Promise<string | any[]> =
                                Promise.resolve(
                                    'forEach not implemented or firebase issue'
                                )
                            querySnapshot.forEach((userSnapshot) => {
                                promise = checkPendingInviteAndProcessThem(
                                    userSnapshot.data() as admin.auth.UserRecord
                                )
                            })
                            return promise
                        })
                })
        }

        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(
            'Function failed due to not successful email send'
        )
    })

// From a given user, it check if the user has pending invite for him, if so process it, add it to the linked project or
// organization and complete the invite after
export const checkPendingInviteAndProcessThem = (
    user: admin.auth.UserRecord
) => {
    const userId = user.uid
    const userInfo = user.email || user.phoneNumber

    return admin
        .firestore()
        .collection('invites')
        .where('destinationUserInfo', '==', userInfo)
        .where('status', '==', 'emailSent')
        .get()
        .then((querySnapshot) => {
            const promises: Promise<any>[] = []
            querySnapshot.forEach((snapshot) => {
                const data = snapshot.data()
                const organizationIdOrProjectId =
                    data.organizationId || data.projectId
                const invitationType: InvitationType = data.organizationId
                    ? InvitationType.OrganizationInvitationType
                    : InvitationType.ProjectInvitationType

                promises.push(
                    new Promise((resolve, reject) => {
                        applyInvites(
                            snapshot.id,
                            invitationType,
                            userId,
                            organizationIdOrProjectId,
                            data.role
                        )
                            .then((result) => resolve(result))
                            .catch((error) => reject(error))
                    })
                )
            })
            return Promise.all(promises)
        })
}
