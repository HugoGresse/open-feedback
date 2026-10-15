import { onUserCreated } from 'firebase-functions/v2/identity'
import { isEmpty } from 'lodash'
import { checkPendingInviteAndProcessThem } from './invites/userInvite'

// Named userCreated (not userCreate): the Firebase CLI cannot upgrade a Gen1
// function to Gen2 in place, so the Gen1 `userCreate` is deleted on deploy.
export const userCreated = onUserCreated(async (event) => {
    const user = event.data
    if (isEmpty(user) || (isEmpty(user.email) && isEmpty(user.phoneNumber))) {
        return 'new anonymous user'
    }

    return checkPendingInviteAndProcessThem(user)
})
