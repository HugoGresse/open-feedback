import * as functions from 'firebase-functions'
import { initFirebase } from './helpers/firebaseInit'
import { getAppEnv } from './helpers/env'

initFirebase(getAppEnv().env)

export {
    aggregateVotesCreate,
    aggregateVotesUpdate,
} from './triggers/aggregateVotes'
export { userInviteCreated } from './triggers/invites/userInvite'
export { userCreate } from './triggers/userCreate'

export { alert } from './callable/alert'
export { deleteProject } from './callable/deleteProject'
export { resizeAndMoveImage } from './callable/resizeAndMoveImage'
export { removeFileFromStorage } from './callable/removeFileFromStorage'

// Http request
export { sendContactEmail } from './http/sendContactEmail'
