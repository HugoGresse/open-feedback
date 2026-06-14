import * as functions from 'firebase-functions/v1'
import { isEmpty } from 'lodash'
import { checkPendingInviteAndProcessThem } from './invites/userInvite'

// NOTE: Auth onCreate triggers exist only in Gen1 (firebase-functions/v1), and
// Gen1 does not support the nodejs24 runtime. Because engines.node applies to
// the whole codebase, this function caps the functions runtime at nodejs22.
// Bumping to nodejs24 requires moving this off the Gen1 auth trigger first.
// Tracking: https://github.com/HugoGresse/open-feedback/issues/1678
// Upstream (v2 auth triggers): https://github.com/firebase/firebase-functions/issues/1383
export const userCreate = functions.auth.user().onCreate(async (user) => {
    if (isEmpty(user) || (isEmpty(user.email) && isEmpty(user.phoneNumber))) {
        return Promise.resolve('new anonymous user')
    }

    return checkPendingInviteAndProcessThem(user)
})
