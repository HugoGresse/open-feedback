import type { AppThunk } from '../../../../store'
import type { Organization } from '../../../../core/models'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
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
        const filter = organizationId
            ? where('organizationId', '==', organizationId)
            : where(`members`, 'array-contains', getUserIdSelector(getState()))

        return getDocs(
            query(
                collection(fireStoreMainInstance, 'projects'),
                filter,
                orderBy('createdAt', 'desc')
            )
        )
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
