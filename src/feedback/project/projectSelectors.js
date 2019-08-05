import { createSelector } from 'reselect'
import { VOTE_TYPE_TEXT } from '../vote/voteReducer'
import { orderBy } from 'lodash/collection'

const getProjects = state => state.project
const getProjectsData = state => state.project.data

export const getProjectSelector = state =>
    getProjectsData(state).id ? getProjectsData(state) : null

export const getProjectFirebaseConfigSelector = state =>
    getProjectSelector(state).firebaseConfig

export const getProjectVoteItemsSelector = state =>
    getProjectSelector(state).voteItems

export const getProjectVoteResultsSelector = state =>
    getProjectSelector(state).sessionVotes

export const getProjectLoadErrorSelector = state =>
    getProjects(state).projectLoadError
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
        return orderBy(
            voteItems.sort(a => (a.type === VOTE_TYPE_TEXT ? 1 : -1)),
            ['position'],
            ['asc']
        )
    }
)
