import { createSelector } from 'reselect'
import { getSelectedSessionId } from '../session/core/sessionSelectors'

const getProjects = state => state.project

export const getProjectSelector = state =>
    getProjects(state).id ? getProjects(state) : null

export const getProjectVoteItemsSelector = state =>
    getProjectSelector(state).voteItems

export const getProjectVoteResults = state =>
    getProjectSelector(state).sessionVotes

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
