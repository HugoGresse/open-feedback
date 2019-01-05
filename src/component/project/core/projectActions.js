import {
    GET_PROJECT_ERROR,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_VOTE_ITEMS_ERROR,
    GET_PROJECT_VOTE_ITEMS_SUCCESS
} from './projectActionTypes'
import { fireStoreMainInstance, initFireStoreSchedule } from '../../../firebase'
import { getProjectSelector } from './projectSelectors'

export const getProject = projectId => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(projectId)
            .get()
            .then(projectSnapshot => {
                if (projectSnapshot.exists) {
                    const project = projectSnapshot.data()
                    project.id = projectId

                    initFireStoreSchedule(project.firebaseConfig)

                    dispatch({
                        type: GET_PROJECT_SUCCESS,
                        payload: project
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

export const getVoteItems = () => {
    return (dispatch, getState) => {
        return fireStoreMainInstance
            .collection('projects')
            .doc(getProjectSelector(getState()).id)
            .collection('voteItems')
            .get()
            .then(projectSnapshot => {
                const voteItems = []
                projectSnapshot.forEach(doc => {
                    voteItems.push({
                        ...doc.data(),
                        id: doc.id
                    })
                })

                dispatch({
                    type: GET_PROJECT_VOTE_ITEMS_SUCCESS,
                    payload: voteItems
                })
                console.log(voteItems)
            })
            .catch(err => {
                dispatch({
                    type: GET_PROJECT_VOTE_ITEMS_ERROR,
                    payload: err
                })
            })
    }
}
