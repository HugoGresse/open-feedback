import type { Organization } from '../../../../core/models'
import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import { getUserSelector } from '../../../auth/authSelectors'
import {
    GET_ORGANIZATIONS_ERROR,
    GET_ORGANIZATIONS_SUCCESS,
} from '../organizationActionTypes'
import { addNotification } from '../../../notification/notifcationActions'
import {
    ORGANIZATION_ROLE_ID,
    ORGANIZATION_USER_ROLE_VIEWER,
} from '../organizationConstants'
import { getProjects } from '../../../project/core/actions/getProjects'

export const getOrganizations =
    (): AppThunk<Promise<void> | undefined> => (dispatch, getState) => {
        const user = getUserSelector(getState())

        if (!user) {
            return
        }

        return fireStoreMainInstance
            .collection('organizations')
            .where(
                ORGANIZATION_ROLE_ID[ORGANIZATION_USER_ROLE_VIEWER],
                'array-contains',
                user.uid
            )
            .orderBy('createdAt', 'desc')
            .get()
            .then((querySnapshot) => {
                const organizations: Organization[] = []
                querySnapshot.forEach((doc) => {
                    organizations.push({
                        id: doc.id,
                        ...doc.data(),
                    } as Organization)
                })

                dispatch({
                    type: GET_ORGANIZATIONS_SUCCESS,
                    payload: organizations,
                })

                organizations.forEach((org) => {
                    dispatch(getProjects(org.id))
                })
            })
            .catch((err: unknown) => {
                dispatch({
                    type: GET_ORGANIZATIONS_ERROR,
                    payload: String(err),
                })
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'organization.errorsLoadOrganizations',
                    })
                )
            })
    }
