import { functions } from '../../../../firebase.ts'
import { addNotification } from '../../../notification/notifcationActions'

export const deleteProject = (projectId, t) => (dispatch) =>
    functions
        .deleteProject({
            projectId: projectId,
        })
        // eslint-disable-next-line no-console
        .then(() => {
            dispatch(
                addNotification({
                    type: 'success',
                    message: t('settingsSetup.deleteEvent.deleted'),
                })
            )
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)

            if (error.code === 'permission-denied') {
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
                            t('settingsSetup.deleteEvent.errors.defaultError') +
                            error.toString(),
                    })
                )
            }

            return Promise.reject()
        })
