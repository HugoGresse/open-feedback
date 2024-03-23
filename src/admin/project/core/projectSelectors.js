import { createSelector } from 'reselect'
import { getAdminStateSelector } from '../../adminSelector'
import { NO_ORGANIZATION_FAKE_ID } from '../../organization/core/organizationConstants'
import { getOrganizationsSelector } from '../../organization/core/organizationSelectors'
import {
    PROJECT_USER_ROLE_MEMBER,
    PROJECT_USER_ROLE_OWNER,
} from '../settings/users/ProjectUserRoles.jsx'

const getProjects = (state) => getAdminStateSelector(state).adminProject
const getProjectsData = (state) => getProjects(state).data

export const isProjectsLoadedSelector = (state) =>
    getProjects(state).projectsLoaded

export const getSelectedProjectIdSelector = (state) =>
    getProjects(state).selectedProjectId

export const isProjectApiInitSelector = (state) =>
    getProjects(state).projectApiInit

export const getOwnerId = (state) => getSelectedProjectSelector(state).owner

export const getLanguagesSelector = (state) =>
    getSelectedProjectSelector(state).languages || []

export const getStartTimeSelector = (state) =>
    getSelectedProjectSelector(state).voteStartTime

// MEMOIZED

export const getSelectedProjectSelector = createSelector(
    getProjectsData,
    getSelectedProjectIdSelector,
    (projectsData, selectedProjectId) => {
        const projects = projectsData.projects
        if (!projects || projects.length < 1) {
            return null
        }
        return projects.filter((project) => project.id === selectedProjectId)[0]
    }
)

export const getMemberIds = createSelector(
    getSelectedProjectSelector,
    getOwnerId,
    (project, ownerUserId) => {
        const members = project.members.reduce((acc, userId) => {
            acc[userId] = {
                userId,
                role: PROJECT_USER_ROLE_MEMBER,
            }
            return acc
        }, {})

        members[ownerUserId] = {
            userId: ownerUserId,
            role: PROJECT_USER_ROLE_OWNER,
        }
        return Object.values(members)
    }
)

export const getSortedProjectsSelector = createSelector(
    getProjectsData,
    (projectsData) => {
        return projectsData.projects.sort((a, b) => {
            if (a.createdAt < b.createdAt) {
                return 1
            }
            if (a.createdAt > b.createdAt) {
                return -1
            }
            return 0
        })
    }
)

export const getSortedProjectsByOrganizationIdsSelector = createSelector(
    getSortedProjectsSelector,
    getOrganizationsSelector,
    (projects, organizations) => {
        const orgsWithProjects = projects
            .sort((a, b) => {
                // Re-do the sort to avoid weird flicker due to object key not keeping it's order
                if (a.createdAt < b.createdAt) {
                    return 1
                }
                if (a.createdAt > b.createdAt) {
                    return -1
                }
                return 0
            })
            .sort((a) => {
                if (!a.organizationId) {
                    return -1
                }
                return 0
            })
            .reduce(
                (acc, project) => {
                    const organizationId =
                        project.organizationId || NO_ORGANIZATION_FAKE_ID
                    if (!acc[organizationId]) {
                        acc[organizationId] = {
                            projects: [],
                        }
                    }
                    acc[organizationId].projects.push(project)
                    return acc
                },
                {
                    NO_ORGANIZATION_FAKE_ID: {
                        projects: [],
                    },
                }
            )

        // Add empty projects an hydrate org data
        return organizations.reduce((acc, organization) => {
            if (!acc[organization.id]) {
                acc[organization.id] = {
                    ...organization,
                    projects: [],
                }
            } else {
                acc[organization.id] = {
                    ...acc[organization.id],
                    ...organization,
                }
            }
            return acc
        }, orgsWithProjects)
    }
)
