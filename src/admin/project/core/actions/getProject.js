import { fireStoreMainInstance } from '../../../../firebase'
import { getSelectedProjectIdSelector } from '../projectSelectors'
import { GET_PROJECT_ERROR, GET_PROJECT_SUCCESS } from '../projectActionTypes'
import { addNotification } from '../../../notification/notifcationActions'

export const getProject = (selectedProjectId = null) => (
    dispatch,
    getState
) => {
    return fireStoreMainInstance
        .collection('projects')
        .doc(selectedProjectId || getSelectedProjectIdSelector(getState()))
        .get()
        .then((doc) => {
            dispatch({
                type: GET_PROJECT_SUCCESS,
                payload: {
                    id: doc.id,
                    ...doc.data(),
                },
            })
        })
        .catch((err) => {
            dispatch({
                type: GET_PROJECT_ERROR,
                payload: err.toString(),
            })
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'project.errorLoad',
                })
            )
        })
}
