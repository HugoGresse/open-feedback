import { createSelector } from 'reselect'
import { VOTE_TYPE_TEXT } from '../../core/contants'

const getProjects = state => state.project
const getProjectsData = state => state.project.data

export const getProjectSelector = state =>
    getProjectsData(state).id ? getProjectsData(state) : null

export const getProjectConfigSelector = state =>
    getProjectSelector(state).config
        ? getProjectSelector(state).config
        : getProjectSelector(state).firebaseConfig

export const getProjectVoteItemsSelector = state =>
    getProjectSelector(state).voteItems

export const getProjectVoteResultsSelector = state =>
    getProjectSelector(state).talkVotes

export const getProjectLoadErrorSelector = state =>
    getProjects(state).projectLoadError
export const isProjectNotFoundSelector = state =>
    getProjects(state).projectLoadNotFound

export const getProjectSelectedDateSelector = state =>
    getProjects(state).selectedDate

export const getProjectVotesErrorSelector = state =>
    getProjects(state).projectVotesError

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
            if (a.type === VOTE_TYPE_TEXT) return 1
            return a.position > b.position ? 1 : -1
        })
    }
)
