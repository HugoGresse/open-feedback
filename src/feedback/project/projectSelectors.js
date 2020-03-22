import { createSelector } from 'reselect'

const getProjectState = state => state.project

const getProject = state => getProjectState(state).project

export const getProjectSelector = state =>
    getProject(state).id ? getProject(state) : null

export const getProjectIdSelector = state => getProject(state).id

export const getProjectVoteItemsSelector = state =>
    getProjectSelector(state).voteItems

export const getProjectVoteResultsSelector = state =>
    getProjectState(state).talkVotes

export const getProjectLoadErrorSelector = state =>
    getProjectState(state).projectLoadError
export const isProjectNotFoundSelector = state =>
    getProjectState(state).projectLoadNotFound

export const getProjectSelectedDateSelector = state =>
    getProjectState(state).selectedDate

export const getProjectVotesErrorSelector = state =>
    getProjectState(state).projectVotesError

export const getProjectChipColorsSelector = state =>
    getProjectSelector(state).chipColors

//  MEMOIZED SELECTORS HERE

export const getProjectVoteItemsOrderedSelector = createSelector(
    getProjectVoteItemsSelector,
    voteItems => {
        if (!voteItems) {
            return []
        }
        return voteItems.sort((a, b) => {
            return a.position > b.position ? 1 : -1
        })
    }
)
