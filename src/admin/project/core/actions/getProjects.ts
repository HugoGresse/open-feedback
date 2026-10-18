import type { AppThunk } from '../../../../store'
import type firebase from 'firebase/compat/app'
import type { Organization } from '../../../../core/models'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import { getUserIdSelector } from '../../../auth/authSelectors'
import {
    type AdminProject,
    GET_PROJECTS_ERROR,
    GET_PROJECTS_SUCCESS,
} from '../projectActionTypes'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../projectSelectors'
import { addNotification } from '../../../notification/notifcationActions'
import { initProjectApiIfReady } from './initProjectApi'
import { getOrganizationsSelector } from '../../../organization/core/organizationSelectors'

export const getProjects =
    (organizationId: string | null = null): AppThunk<Promise<void>> =>
    (dispatch, getState) => {
        let baseQuery: firebase.firestore.Query =
            fireStoreMainInstance.collection('projects')

        if (organizationId) {
            baseQuery = baseQuery.where('organizationId', '==', organizationId)
        } else {
            baseQuery = baseQuery.where(
                `members`,
                'array-contains',
                getUserIdSelector(getState())
            )
        }

        return baseQuery
            .orderBy('createdAt', 'desc')
            .get()
            .then((projectsSnapshot) => {
                const organizations: Organization[] = getOrganizationsSelector(
                    getState()
                )
                const projects: AdminProject[] = []
                projectsSnapshot.forEach((doc) => {
                    // Firestore boundary
                    const project = {
                        id: doc.id,
                        ...doc.data(),
                    } as AdminProject
                    if (project.organizationId) {
                        const org = organizations.find(
                            (org) => org.id === project.organizationId
                        )
                        if (org) {
                            project.organizationName = org.name
                        }
                    }
                    projects.push(project)
                })

                dispatch({
                    type: GET_PROJECTS_SUCCESS,
                    payload: projects,
                })
            })
            .then(() => {
                dispatch(
                    initProjectApiIfReady(
                        getSelectedProjectIdSelector(getState()),
                        getSelectedProjectSelector(getState())
                    )
                )
            })
            .catch((err: unknown) => {
                dispatch({
                    type: GET_PROJECTS_ERROR,
                    payload: String(err),
                })
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'project.errorProjectsLoad',
                    })
                )
            })
    }
