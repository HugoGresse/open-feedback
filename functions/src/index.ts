import * as functions from 'firebase-functions';
import {initFirebase} from "./helpers/firebaseInit";

initFirebase(functions.config().app.env)

export {
    aggregateVotesCreate,
    aggregateVotesDelete,
    aggregateVotesUpdate
} from './triggers/aggregateVotes'

export {
    userInviteCreated
} from './triggers/userInvite'
