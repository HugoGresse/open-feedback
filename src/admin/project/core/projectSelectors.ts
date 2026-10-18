import { getAdminStateSelector } from '../../adminSelector'
import { NO_ORGANIZATION_FAKE_ID } from '../../organization/core/organizationConstants'
import { getOrganizationsSelector } from '../../organization/core/organizationSelectors'
import {
    PROJECT_USER_ROLE_MEMBER,
    PROJECT_USER_ROLE_OWNER,
    type ProjectUserRole,
} from '../settings/users/ProjectUserRoles.tsx'
import { createAppSelector, type RootState } from '../../../store'
import type { Organization } from '../../../core/models'
import type { AdminProject } from './projectActionTypes'
import type { ProjectState } from './projectReducer'

export interface ProjectMember {
    userId: string
    role: ProjectUserRole
}

/**
 * An organization (or the fake "no organization" group) with its projects. The
 * organization fields are missing for groups whose organization is not loaded.
 */
export interface OrganizationWithProjects extends Partial<Organization> {
    projects: AdminProject[]
}

const getProjects = (state: RootState): ProjectState =>
    getAdminStateSelector(state).adminProject
const getProjectsData = (state: RootState): ProjectState['data'] =>
    getProjects(state).data

export const isProjectsLoadedSelector = (state: RootState): boolean =>
    getProjects(state).projectsLoaded

export const getSelectedProjectIdSelector = (state: RootState): string | null =>
    getProjects(state).selectedProjectId

/**
 * Only valid while a project is selected: throws otherwise. For Firestore
 * paths, where the untyped code passed the null id and Firestore threw.
 */
export const getSelectedProjectIdOrThrowSelector = (
    state: RootState
): string => {
    const projectId = getSelectedProjectIdSelector(state)
    if (!projectId) {
        throw new TypeError('No selected project id')
    }
    return projectId
}

export const isProjectApiInitSelector = (state: RootState): boolean =>
    getProjects(state).projectApiInit

/**
 * Only valid while a project is selected: throws otherwise, like the untyped
 * `getSelectedProjectSelector(state).field` accesses did.
 */
const getSelectedProjectOrThrow = (state: RootState): AdminProject => {
    const project = getSelectedProjectSelector(state)
    if (!project) {
        throw new TypeError('No selected project')
    }
    return project
}

export const getOwnerId = (state: RootState): string =>
    getSelectedProjectOrThrow(state).owner

export const getStartTimeSelector = (
    state: RootState
): string | null | undefined => getSelectedProjectOrThrow(state).voteStartTime

// MEMOIZED

export const getSelectedProjectSelector = createAppSelector(
    [getProjectsData, getSelectedProjectIdSelector],
    (projectsData, selectedProjectId): AdminProject | null | undefined => {
        const projects = projectsData.projects
        if (!projects || projects.length < 1) {
            return null
        }
        return projects.find((project) => project.id === selectedProjectId)
    }
)

export const getLanguagesSelector = createAppSelector(
    [getSelectedProjectSelector],
    (project): string[] => (project && project.languages) || []
)

export const getMemberIds = createAppSelector(
    [getSelectedProjectSelector, getOwnerId],
    (project, ownerUserId): ProjectMember[] => {
        if (!project) {
            throw new TypeError('No selected project')
        }
        const members = project.members.reduce<Record<string, ProjectMember>>(
            (acc, userId) => {
                acc[userId] = {
                    userId,
                    role: PROJECT_USER_ROLE_MEMBER,
                }
                return acc
            },
            {}
        )

        members[ownerUserId] = {
            userId: ownerUserId,
            role: PROJECT_USER_ROLE_OWNER,
        }
        return Object.values(members)
    }
)

// Firestore Timestamps compare through their valueOf() string.
const compareCreatedAtDesc = (a: AdminProject, b: AdminProject): number => {
    const aCreatedAt = a.createdAt?.valueOf()
    const bCreatedAt = b.createdAt?.valueOf()
    if (aCreatedAt === undefined || bCreatedAt === undefined) {
        // `undefined < x` and `undefined > x` are both false.
        return 0
    }
    if (aCreatedAt < bCreatedAt) {
        return 1
    }
    if (aCreatedAt > bCreatedAt) {
        return -1
    }
    return 0
}

export const getSortedProjectsSelector = createAppSelector(
    [getProjectsData],
    (projectsData): AdminProject[] => {
        return projectsData.projects.sort(compareCreatedAtDesc)
    }
)

export const getSortedProjectsByOrganizationIdsSelector = createAppSelector(
    [getSortedProjectsSelector, getOrganizationsSelector],
    (
        projects: AdminProject[],
        organizations: Organization[]
    ): Record<string, OrganizationWithProjects> => {
        const orgsWithProjects = projects
            // Re-do the sort to avoid weird flicker due to object key not keeping it's order
            .sort(compareCreatedAtDesc)
            .sort((a) => {
                if (!a.organizationId) {
                    return -1
                }
                return 0
            })
            .reduce<Record<string, OrganizationWithProjects>>(
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
