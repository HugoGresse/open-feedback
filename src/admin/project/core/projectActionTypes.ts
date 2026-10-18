import type { FieldValue, Project } from '../../../core/models'

export const GET_PROJECTS_SUCCESS = 'admin/projects/get/success'
export const GET_PROJECTS_ERROR = 'admin/projects/get/error'
export const GET_PROJECT_SUCCESS = 'admin/project/get/success'
export const GET_PROJECT_ERROR = 'admin/project/get/error'
export const SELECT_PROJECT = 'admin/project/select'

export const EDIT_PROJECT_SUCCESS = 'admin/project/edit/success'
export const EDIT_PROJECT_ERROR = 'admin/project/edit/error'

export const ADD_PROJECT_SUCCESS = 'admin/project/add/success'
export const ADD_PROJECT_ONGOING = 'admin/project/add/ongoing'
export const ADD_PROJECT_ERROR = 'admin/project/add/error'

export const INIT_PROJECTAPI = 'admin/project/projectApi/init'

/**
 * A project as held in the admin store. `getProjects` adds the name of the
 * organization the project belongs to, when that organization is loaded.
 */
export interface AdminProject extends Project {
    organizationName?: string
}

/**
 * The partial project `editProject` writes (merge) to Firestore. Any field may
 * be a Firestore sentinel such as `deleteField()`.
 */
export type ProjectEditData = {
    [K in keyof Omit<Project, 'id'>]?: Project[K] | FieldValue
}

export type SelectProjectAction = {
    type: typeof SELECT_PROJECT
    payload: string | null
}

export type ProjectAction =
    | { type: typeof GET_PROJECTS_SUCCESS; payload: AdminProject[] }
    | { type: typeof GET_PROJECTS_ERROR; payload: string }
    | { type: typeof GET_PROJECT_SUCCESS; payload: AdminProject }
    | { type: typeof GET_PROJECT_ERROR; payload: string }
    | SelectProjectAction
    | { type: typeof EDIT_PROJECT_SUCCESS; payload: Partial<Project> }
    | { type: typeof EDIT_PROJECT_ERROR; payload: string }
    | { type: typeof ADD_PROJECT_SUCCESS; payload: string }
    | { type: typeof ADD_PROJECT_ONGOING }
    | { type: typeof ADD_PROJECT_ERROR; payload: string }
    | { type: typeof INIT_PROJECTAPI }
