import * as functions from 'firebase-functions'
import { initFirebase } from './helpers/firebaseInit'

initFirebase(functions.config().app.env)

export {
    aggregateVotesCreate,
    aggregateVotesUpdate,
} from './triggers/aggregateVotes'
export { userInviteCreated } from './triggers/userInvite'
export { userCreate } from './triggers/userCreate'

export { alert } from './callable/alert'
export { deleteProject } from './callable/deleteProject'
export { resizeAndMoveImage } from './callable/resizeAndMoveImage'
export { removeFileFromStorage } from './callable/removeFileFromStorage'
