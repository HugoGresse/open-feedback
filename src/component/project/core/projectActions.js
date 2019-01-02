import { GET_PROJECT_ERROR, GET_PROJECT_SUCCESS } from './projectActionTypes'
import { fireStoreMainInstance, initFireStoreSchedule } from '../../../firebase'

export const getProject = projectId => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .get()
            .then(projectSnapshot => {
                if (projectSnapshot.exists) {
                    initFireStoreSchedule(projectSnapshot.data().firebaseConfig)
                    dispatch({
                        type: GET_PROJECT_SUCCESS,
                        payload: projectSnapshot.data()
                    })
                } else {
                    // TODO : manage unknown project
                    dispatch({
                        type: GET_PROJECT_ERROR,
                        payload: 'Unknown project id'
                    })
                }
            })
            .catch(err => {
                dispatch({
                    type: GET_PROJECT_ERROR,
                    payload: err
                })
            })
    }
}
