const getProjects = state => state.project
const getProjectsData = state => state.project.data

export const getProjectSelector = state =>
    getProjectsData(state).id ? getProjectsData(state) : null

export const getProjectVoteItemsSelector = state =>
    getProjectSelector(state).voteItems

export const getProjectVoteResults = state =>
    getProjectSelector(state).sessionVotes

export const getProjectLoadError = state => getProjects(state).projectLoadError
export const getProjectSelectedDate = state => getProjects(state).selectedDate

export const getProjectVotesError = state =>
    getProjects(state).projectVotesError

export const getProjectChipColors = state =>
    getProjectSelector(state).chipColors

//  MEMOIZED SELECTORS HERE
