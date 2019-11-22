import * as functions from "firebase-functions"
import {isEmpty} from 'lodash'
import {checkPendingInviteAndProcessThem} from './userInvite'

export const userCreate = functions.auth.user()
    .onCreate(async (user) => {
        if (isEmpty(user) || (isEmpty(user.email) && isEmpty(user.phoneNumber))) {
            return Promise.resolve('new anonymous user')
        }

        return checkPendingInviteAndProcessThem(user)
    })
