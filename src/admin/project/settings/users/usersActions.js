import {fireStoreMainInstance} from '../../../../firebase'
import {ADD_NOTIFICATION} from '../../../notification/notificationActionTypes'
import {GET_USER_DETAILS_SUCCESS, USERS_SET_FILTER} from './usersActionTypes'
import {getUsersSelector} from './usersSelectors'
import {editProject} from '../../core/projectActions'
import {getMemberIds} from '../../core/projectSelectors'

export const getUserDetails = (uid) => (dispatch, getState) => {
    const usersDetails = getUsersSelector(getState())

    if(usersDetails && usersDetails[uid]) {
        // prevent load if data are already there
        return
    }

    return fireStoreMainInstance
        .collection('users')
        .doc(uid)
        .get()
        .then(snapshot => {
            if(snapshot.exists) {
                dispatch({
                    type: GET_USER_DETAILS_SUCCESS,
                    payload: snapshot.data()
                })
            } else {
                dispatch({
                    type: ADD_NOTIFICATION,
                    payload: {
                        type: 'error',
                        message: `User ${uid} does not exist`
                    }
                })
            }
        })
        .catch(error => {
            // eslint-disable-next-line no-console
            console.error(error)
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: `Failed to load user ${uid} details, ${JSON.stringify(error)}`
                }
            })
        })
}

export const removeUserFromProject = (userId) => (dispatch, getState) => {
    const currentMembers = getMemberIds(getState())

    return dispatch(editProject({
        members: currentMembers.filter(memberId => memberId !== userId)
    }))
}

export const inviteUser = userEmail => (dispatch, getState) => {
    dispatch({
        type: ADD_NOTIFICATION,
        payload: {
            type: 'error',
            message: `This feature is not ready yet. See https://github.com/HugoGresse/open-feedback/issues/55`
        }
    })
}

export const setUsersFilter = filterValue => ({
    type: USERS_SET_FILTER,
    payload: filterValue.trim()
})
