import { getAdminStateSelector } from '../../adminSelector'

const getModeration = state => getAdminStateSelector(state).adminModeration
const getModerationData = state => getModeration(state).data

export const getTextVotesSelector = state => getModerationData(state).textVotes
export const isTextVotesLoadedSelector = state =>
    getModeration(state).textVotesLoaded
