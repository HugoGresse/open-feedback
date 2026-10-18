import type { TFunction } from 'react-i18next'
import type { AppThunk } from '../../../../store'
import { functions } from '../../../../firebase.ts'
import { addNotification } from '../../../notification/notifcationActions'
import { DELETE_PROJECT_SUCCESS } from '../projectActionTypes'

const getErrorCode = (error: unknown): unknown =>
    typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : undefined

export const deleteProject =
    (projectId: string, t: TFunction): AppThunk<Promise<void>> =>
    (dispatch) =>
        functions
            .deleteProject({
                projectId: projectId,
            })
            .then(() => {
                dispatch({
                    type: DELETE_PROJECT_SUCCESS,
                    payload: projectId,
                })
                dispatch(
                    addNotification({
                        type: 'success',
                        message: t('settingsSetup.deleteEvent.deleted'),
                    })
                )
            })
            .catch((error: unknown) => {
                // eslint-disable-next-line no-console
                console.error(error)

                // Callable errors codes are prefixed by the "functions/" service
                if (getErrorCode(error) === 'functions/permission-denied') {
                    dispatch(
                        addNotification({
                            type: 'error',
                            message: t(
                                'settingsSetup.deleteEvent.errors.permissionDenied'
                            ),
                        })
                    )
                } else {
                    dispatch(
                        addNotification({
                            type: 'error',
                            message:
                                t(
                                    'settingsSetup.deleteEvent.errors.defaultError'
                                ) + String(error),
                        })
                    )
                }

                return Promise.reject()
            })
