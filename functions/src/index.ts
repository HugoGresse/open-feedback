import { initFirebase } from './helpers/firebaseInit'

initFirebase()

export {
    aggregateVotesCreate,
    aggregateVotesUpdate,
} from './triggers/aggregateVotes'
export { userInviteCreated } from './triggers/invites/userInvite'
export { userCreate } from './triggers/userCreate'

export { alert } from './callable/alert'
export { deleteProject } from './callable/deleteProject'

// Http request
export { sendContactEmail } from './http/sendContactEmail'
