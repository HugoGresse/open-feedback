import { fireStoreMainInstance } from '../../../../firebase'
import {
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../projectSelectors'
import { GET_PROJECT_ERROR, GET_PROJECT_SUCCESS } from '../projectActionTypes'
import { addNotification } from '../../../notification/notifcationActions'
import { initProjectApiIfReady } from './initProjectApi'

export const getProject = (selectedProjectId = null, initAPI) => (
    dispatch,
    getState
) => {
    return fireStoreMainInstance
        .collection('projects')
        .doc(selectedProjectId || getSelectedProjectIdSelector(getState()))
        .get()
        .then((doc) => {
            if (doc.exists) {
                return dispatch({
                    type: GET_PROJECT_SUCCESS,
                    payload: {
                        id: doc.id,
                        ...doc.data(),
                    },
                })
            } else {
                dispatch({
                    type: GET_PROJECT_ERROR,
                    payload: 'Event does not exist',
                })
            }
        })
        .then(() => {
            if (initAPI) {
                dispatch(
                    initProjectApiIfReady(
                        getSelectedProjectIdSelector(getState()),
                        getSelectedProjectSelector(getState())
                    )
                )
            }
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
