import type { Organization } from '../../../../core/models'
import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import {
    GET_ORGANIZATION_SUCCESS,
    GET_ORGANIZATIONS_ERROR,
} from '../organizationActionTypes'
import { addNotification } from '../../../notification/notifcationActions'

export const getOrganization =
    (organizationId: string): AppThunk<Promise<Organization | undefined>> =>
    (dispatch) => {
        return fireStoreMainInstance
            .collection('organizations')
            .doc(organizationId)
            .get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    const data = {
                        id: organizationId,
                        ...docSnapshot.data(),
                    } as Organization
                    dispatch({
                        type: GET_ORGANIZATION_SUCCESS,
                        payload: data,
                    })
                    return data
                } else {
                    dispatch(
                        addNotification({
                            type: 'error',
                            i18nkey: 'organization.errorsLoadOrganizations',
                        })
                    )
                }
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
                return undefined
            })
    }
