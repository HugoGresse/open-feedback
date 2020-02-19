import { createSelector } from 'reselect'
import { getAdminStateSelector } from '../../adminSelector'

const getModeration = state => getAdminStateSelector(state).adminModeration
const getModerationData = state => getModeration(state).data
const getTextVotes = state => getModerationData(state).textVotes

// MEMOIZED

export const getTextVotesSelector = createSelector(getTextVotes, votes => {
    return votes
})
