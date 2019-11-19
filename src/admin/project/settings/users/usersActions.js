import {fireStoreMainInstance, serverTimestamp} from '../../../../firebase'
import {ADD_NOTIFICATION} from '../../../notification/notificationActionTypes'
import {GET_USER_DETAILS_SUCCESS, USERS_SET_FILTER} from './usersActionTypes'
import {getUsersSelector} from './usersSelectors'
import {editProject} from '../../core/projectActions'
import {getMemberIds, getSelectedProjectSelector} from '../../core/projectSelectors'
import {getUserSelector} from '../../../auth/authSelectors'
import {getDataFromProviderDataOrUser} from '../../../auth/authActions'

export const getUserDetails = (uid) => (dispatch, getState) => {
    const usersDetails = getUsersSelector(getState())

    if (usersDetails && usersDetails[uid]) {
        // prevent load if data are already there
        return
    }

    return fireStoreMainInstance
        .collection('users')
        .doc(uid)
        .get()
        .then(snapshot => {
            if (snapshot.exists) {
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
    const currentUser = getUserSelector(getState())
    const project = getSelectedProjectSelector(getState())

    return fireStoreMainInstance
        .collection('projects-invites')
        .add({
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            destinationUserInfo: userEmail,
            originUserId: currentUser.uid,
            originUserName: currentUser.displayName,
            originUserPhotoURL: getDataFromProviderDataOrUser(currentUser, 'photoURL'),
            projectId: project.id,
            projectName: project.name,
            status: 'new'
        })
        .then(() => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'success',
                    message: `The user has been invited to the project and should receive an email very soon.`
                }
            })
            return true
        })
        .catch(error => {
            // eslint-disable-next-line no-console
            console.error(error)
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: `Failed to invite user ${userEmail}, ${JSON.stringify(error)}`
                }
            })
            return false
        })
}

export const setUsersFilter = filterValue => ({
    type: USERS_SET_FILTER,
    payload: filterValue.trim()
})
