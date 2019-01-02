export const getProjects = state => state.project

export const getCurrentProject = state => getProjects(state).currentProject

//  MEMOIZED SELECTORS HERE
