const getProjects = state => state.project

export const getProjectSelector = state =>
    getProjects(state).id ? getProjects(state) : null

export const getProjectVoteItemsSelector = state =>
    getProjectSelector(state).voteItems

//  MEMOIZED SELECTORS HERE
