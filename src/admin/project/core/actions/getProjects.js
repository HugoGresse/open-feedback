import { fireStoreMainInstance } from '../../../../firebase'
import { getUserSelector } from '../../../auth/authSelectors'
import { GET_PROJECTS_ERROR, GET_PROJECTS_SUCCESS } from '../projectActionTypes'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../projectSelectors'
import { addNotification } from '../../../notification/notifcationActions'
import { initProjectApiIfReady } from './initProjectApi'

export const getProjects = (organizationId = null) => (dispatch, getState) => {
    let baseQuery = fireStoreMainInstance.collection('projects')

    if (organizationId) {
        baseQuery = baseQuery.where('organizationId', '==', organizationId)
    } else {
        baseQuery = baseQuery.where(
            `members`,
            'array-contains',
            getUserSelector(getState()).uid
        )
    }

    return baseQuery
        .orderBy('createdAt', 'desc')
        .get()
        .then((projectsSnapshot) => {
            const projects = []
            projectsSnapshot.forEach((doc) => {
                projects.push({
                    id: doc.id,
                    ...doc.data(),
                })
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
        .catch((err) => {
            dispatch({
                type: GET_PROJECTS_ERROR,
                payload: err.toString(),
            })
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'project.errorProjectsLoad',
                })
            )
        })
}
