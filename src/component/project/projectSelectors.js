import { createSelector } from 'reselect'
import { getSelectedSessionId } from '../session/core/sessionSelectors'
import { VOTE_TYPE_TEXT } from '../vote/voteReducer'

const getProjects = state => state.project

export const getProjectSelector = state =>
    getProjects(state).id ? getProjects(state) : null

export const getProjectVoteItemsSelector = state =>
    getProjectSelector(state).voteItems

export const getProjectVoteResults = state =>
    getProjectSelector(state).sessionVotes

export const getProjectLoadError = state => getProjects(state).projectLoadError

export const getProjectVotesError = state =>
    getProjects(state).projectVotesError

export const getProjectChipColors = state =>
    getProjectSelector(state).chipColors

//  MEMOIZED SELECTORS HERE

export const getVoteResultSelector = createSelector(
    getSelectedSessionId,
    getProjectVoteResults,
    (selectedSessionId, voteResults) => {
        if (!voteResults || !voteResults[selectedSessionId]) {
            return []
        }
        return voteResults[selectedSessionId]
    }
)

export const getProjectVoteItemsOrderedSelector = createSelector(
    getProjectVoteItemsSelector,
    voteItems => {
        if (!voteItems) {
            return []
        }
        return voteItems.sort((a, b) => (a.type === VOTE_TYPE_TEXT ? -1 : 1))
    }
)
