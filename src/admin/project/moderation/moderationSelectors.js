import { createSelector } from 'reselect'
import { getAdminStateSelector } from '../../adminSelector'
import { VOTE_STATUS_ACTIVE, VOTE_STATUS_HIDDEN } from '../../../core/contants'

const getModeration = state => getAdminStateSelector(state).adminModeration
const getModerationData = state => getModeration(state).data

export const getTextVotesSelector = state => getModerationData(state).textVotes
export const isTextVotesLoadedSelector = state =>
    getModeration(state).textVotesLoaded

// MEMOIZED

export const getActiveTextVotesSelector = createSelector(
    getTextVotesSelector,
    talkWithVote => {
        const newData = {}
        Object.keys(talkWithVote).forEach(talkId => {
            newData[talkId] = talkWithVote[talkId].filter(
                vote => vote.status === VOTE_STATUS_ACTIVE
            )
        })
        return newData
    }
)

export const getHiddenTextVotesSelector = createSelector(
    getTextVotesSelector,
    talkWithVote => {
        const newData = {}
        Object.keys(talkWithVote).forEach(talkId => {
            newData[talkId] = talkWithVote[talkId].filter(
                vote => vote.status === VOTE_STATUS_HIDDEN
            )
        })
        return newData
    }
)
