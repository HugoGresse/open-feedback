import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import send from '../email/send'
import userInvited from '../email/templates/userInvited'
import {isEmpty} from 'lodash'
import {Response} from 'node-fetch'
import {arrayUnion, serverTimestamp} from '../helpers/firebaseInit'

// userInviteCreated is called when an user as been invited to a project (to have edit rights).
// An email is sent to him with the invitation link.
// To test
// > firebase functions:config:get > .runtimeconfig.json
// > firebase functions:shell
// > userInviteCreated({projectId: "", projectName: "", originUserName: "", destinationUserInfo: ""})
export const userInviteCreated = functions.firestore
    .document('/projects-invites/{inviteId}')
    .onCreate(async snapshot => {
        const {app, mailgun} = functions.config()
        const inviteId = snapshot.id
        const data = snapshot.data()

        if (!data || isEmpty(data)) {
            return Promise.reject(new Error('Empty data'))
        }

        if (isEmpty(app) || isEmpty(mailgun)) {
            return Promise.reject(
                new Error('No config set on "app" or "mailgun"')
            )
        }

        const sendResult = await send(mailgun, {
            to: [data.destinationUserInfo],
            subject: `[OpenFeedback] ${data.originUserName} invited you to become member of the event "${data.projectName}"`,
            html: userInvited(
                `${data.originUserName} invited you to become a member of the event "${data.projectName}"`,
                `Hey ${data.destinationUserInfo},<br/><br/> I invited you to become a member of the OpenFeedback event <b>${data.projectName}</b>. Click on the button below to accept my invitation.`,
                'View the event',
                `${app.url}/admin/?inviteId=${inviteId}`
            )
        })
        if (sendResult instanceof Response && sendResult.ok) {
            const promises: Promise<any>[] = []
            promises.push(admin
                .firestore()
                .collection('projects-invites')
                .doc(inviteId)
                .update({
                    status: 'emailSent'
                }))
            promises.push(
                admin
                    .firestore()
                    .collection('users')
                    .where('email', '==', data.destinationUserInfo)
                    .limit(1)
                    .get()
                    .then(querySnapshot => {
                        if(querySnapshot.empty) {
                            return Promise.resolve('no user matched')
                        }
                        let promise: Promise<any> = Promise.resolve('forEach not implemented or firebase issue')
                        querySnapshot.forEach(userSnapshot => {
                            promise = checkPendingInviteAndProcessThem(userSnapshot.data() as admin.auth.UserRecord)
                        })
                        return promise
                    })
            )

            return Promise.all(promises)
        }

        return Promise.reject('Function failed due to not successful email send')
    })

// From a given user, it check if the user has pending invite for him, if so process it, add it to the linked project
// and complete the invite after
export const checkPendingInviteAndProcessThem = (user: admin.auth.UserRecord) => {
    const userId = user.uid
    const userInfo = user.email || user.phoneNumber

    return admin
        .firestore()
        .collection('projects-invites')
        .where('destinationUserInfo', '==', userInfo)
        .where('status', '==', 'emailSent')
        .get()
        .then(querySnapshot => {
            const promises: Promise<any>[] = []
            querySnapshot.forEach(snapshot => {
                const data = snapshot.data()
                promises.push(new Promise((resolve, reject) => {
                    admin
                        .firestore()
                        .collection('projects')
                        .doc(data.projectId)
                        .update({
                            members: arrayUnion(userId),
                            updatedAt: serverTimestamp()
                        })
                        .catch((error) => {
                            return admin
                                .firestore()
                                .collection('projects-invites')
                                .doc(snapshot.id)
                                .update({
                                    updatedAt: serverTimestamp(),
                                    status: 'error',
                                    error: JSON.stringify(error)
                                })
                        })
                        .then(() => {
                            return admin
                                .firestore()
                                .collection('projects-invites')
                                .doc(snapshot.id)
                                .update({
                                    updatedAt: serverTimestamp(),
                                    status: 'completed'
                                })
                        })
                        .then((result) => resolve(result))
                        .catch((error) => reject(error))
                }))
            })
            return Promise.all(promises)
        })
}
