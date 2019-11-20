import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import send from "../email/send"
import userInvited from '../email/templates/userInvited'
import {isEmpty} from 'lodash'
import {Response} from "node-fetch"

// userInviteCreated is called when an user as been invited to a project (to have edit rights).
// An email is sent to him with the invitation link.
// To test
// > firebase functions:config:get > .runtimeconfig.json
// > firebase functions:shell
// > userInviteCreated({projectId: "", projectName: "", originUserName: "", destinationUserInfo: ""})
export const userInviteCreated = functions.firestore
    .document('/projects-invites/{inviteId}')
    .onCreate(async (snapshot) => {
        const {app, mailgun} = functions.config()
        const inviteId = snapshot.id
        const data = snapshot.data()

        console.log(app, mailgun)

        if (!data || isEmpty(data)) {
            return Promise.reject(new Error('Empty data'))
        }

        if (isEmpty(app) || isEmpty(mailgun)) {
            return Promise.reject(new Error('No config set on "app" or "mailgun"'))
        }

        const sendResult = await send(mailgun, {
            to: [data.destinationUserInfo],
            subject: `[OpenFeedback] ${data.originUserName} invited you to become member of the event "${data.projectName}"`,
            html: userInvited(
                `${data.originUserName} invited you to become a member of the event "${data.projectName}"`,
                `Hey ${data.destinationUserInfo},<br/><br/> I invited you to become a member of the OpenFeedback event <b>${data.projectName}</b>. Click on the button below to accept my invitation.`,
                "Accept the invitation",
                `${app.url}/admin/invite?id=${inviteId}`)
        })
        if (sendResult instanceof Response && sendResult.ok) {
            return admin.firestore()
                .collection('projects-invites')
                .doc(inviteId)
                .set({
                    status: 'emailSent'
                }, {merge: true})
        }
        return Promise.reject('Function failed due to ??')
    })
