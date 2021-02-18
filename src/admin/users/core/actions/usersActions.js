import {
    fireStoreMainInstance,
    nowTimestamp,
    serverTimestamp,
} from '../../../../firebase'
import {
    GET_USER_DETAILS_SUCCESS,
    USER_INVITE_ADD,
    USER_INVITE_GET_SUCCESS,
    USER_INVITE_REMOVE_SUCCESS,
    USER_INVITES_GET_SUCCESS,
    USERS_SET_FILTER,
} from '../usersActionTypes'
import { getPendingInvitesSelector, getUsersSelector } from '../usersSelectors'
import {
    getMemberIds,
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../../../project/core/projectSelectors'
import { getUserSelector } from '../../../auth/authSelectors'
import { getDataFromProviderDataOrUser } from '../../../auth/authActions'
import { addNotification } from '../../../notification/notifcationActions'
import { editProject } from '../../../project/core/actions/editProject'
import { redirectToProject } from '../../../project/utils/redirectToProject'

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

let stopListenForInvite
export const listenForInvite = (inviteId, history) => (dispatch) => {
    stopListenForInvite = fireStoreMainInstance
        .collection('invites')
        .doc(inviteId)
        .onSnapshot(
            (snapshot) => {
                if (snapshot.exists) {
                    const data = snapshot.data()
                    dispatch({
                        type: USER_INVITE_GET_SUCCESS,
                        payload: snapshot.data(),
                    })
                    if (data.status === 'completed') {
                        redirectToProject(null, data.projectId, history)
                    }
                } else {
                    dispatch(
                        addNotification({
                            type: 'error',
                            i18nkey: 'users.invitationGetFail',
                        })
                    )
                }
            },
            (error) => {
                // eslint-disable-next-line no-console
                console.error(error)
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'users.invitationGetFail',
                    })
                )
                return false
            }
        )
}

export const unsubscribeRealtimeInviteListener = () => () => {
    stopListenForInvite && stopListenForInvite()
}

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
