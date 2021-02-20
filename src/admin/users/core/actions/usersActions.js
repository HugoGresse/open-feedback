import { fireStoreMainInstance } from '../../../../firebase'
import {
    GET_USER_DETAILS_SUCCESS,
    USER_INVITE_REMOVE_SUCCESS,
    USER_INVITES_GET_SUCCESS,
    USERS_SET_FILTER,
} from '../usersActionTypes'
import { getUsersSelector } from '../usersSelectors'
import {
    getMemberIds,
    getSelectedProjectIdSelector,
} from '../../../project/core/projectSelectors'
import { addNotification } from '../../../notification/notifcationActions'
import { editProject } from '../../../project/core/actions/editProject'

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
        .then((snapshot) => {
            if (snapshot.exists) {
                dispatch({
                    type: GET_USER_DETAILS_SUCCESS,
                    payload: snapshot.data(),
                })
            } else {
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'users.errorUserNotExist',
                        message: uid,
                    })
                )
            }
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'users.errorUserLoadFail',
                    message: `${uid}, ${JSON.stringify(error)}`,
                })
            )
        })
}

export const removeUserFromProject = (userId) => (dispatch, getState) => {
    const currentMembers = getMemberIds(getState())

    return dispatch(
        editProject({
            members: currentMembers.filter((memberId) => memberId !== userId),
        })
    )
}

export const setUsersFilter = (filterValue) => ({
    type: USERS_SET_FILTER,
    payload: filterValue.trim(),
})

export const getPendingInvites = () => (dispatch, getState) => {
    const projectId = getSelectedProjectIdSelector(getState())
    fireStoreMainInstance
        .collection('invites')
        .where('projectId', '==', projectId)
        .where('status', 'in', ['new', 'emailSent', 'error'])
        .get()
        .then((querySnapshot) => {
            const pendingInvite = []
            querySnapshot.forEach((snapshot) => {
                pendingInvite.push({
                    id: snapshot.id,
                    ...snapshot.data(),
                })
            })
            return dispatch({
                type: USER_INVITES_GET_SUCCESS,
                payload: pendingInvite,
            })
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'users.errorPendingInvitesFailed',
                    message: `${JSON.stringify(error)}`,
                })
            )
            return false
        })
}

export const cancelInvite = (inviteId) => (dispatch) => {
    fireStoreMainInstance
        .collection('invites')
        .doc(inviteId)
        .delete()
        .then(() =>
            dispatch({
                type: USER_INVITE_REMOVE_SUCCESS,
                payload: inviteId,
            })
        )
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'users.cancelInviteFail',
                    message: `${JSON.stringify(error)}`,
                })
            )
            return false
        })
}
