import { createSelector } from 'reselect'

const getProjects = state => state.adminProject
const getProjectsData = state => getProjects(state).data

export const getProjectsSelector = state => getProjectsData(state).projects

export const isProjectsLoadedSelector = state =>
    getProjects(state).projectsLoaded

export const getSelectedProjectIdSelector = state =>
    getProjects(state).selectedProjectId

// MEMOIZED

export const getSelectedProjectSelector = createSelector(
    getProjectsSelector,
    getSelectedProjectIdSelector,
    (projects, selectedProjectId) => {
        if (!projects || projects.length < 1) {
            return null
        }
        return projects.filter(project => project.id === selectedProjectId)[0]
    }
)
