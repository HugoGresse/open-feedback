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
} from './usersActionTypes'
import { getPendingInvitesSelector, getUsersSelector } from './usersSelectors'
import {
    getMemberIds,
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../../core/projectSelectors'
import { getUserSelector } from '../../../auth/authSelectors'
import { getDataFromProviderDataOrUser } from '../../../auth/authActions'
import { addNotification } from '../../../notification/notifcationActions'
import { editProject } from '../../core/actions/editProject'

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
                        i18nkey: 'settingsUser.errorUserNotExist',
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
                    i18nkey: 'settingsUser.errorUserLoadFail',
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

export const inviteUser = (userEmail) => (dispatch, getState) => {
    const pendingInvites = getPendingInvitesSelector(getState())
    if (
        pendingInvites.filter(
            (invite) => invite.destinationUserInfo === userEmail
        ).length > 0
    ) {
        dispatch(
            addNotification({
                type: 'error',
                i18nkey: 'settingsUser.errorUserAlreadyInvited',
            })
        )
        return Promise.resolve(false)
    }

    const currentUser = getUserSelector(getState())
    const project = getSelectedProjectSelector(getState())
    const invite = {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        destinationUserInfo: userEmail,
        originUserId: currentUser.uid,
        originUserName: currentUser.displayName,
        originUserPhotoURL: getDataFromProviderDataOrUser(
            currentUser,
            'photoURL'
        ),
        projectId: project.id,
        projectName: project.name,
        status: 'new',
    }

    return fireStoreMainInstance
        .collection('projects-invites')
        .add(invite)
        .then((docRef) => {
            dispatch(
                addNotification({
                    type: 'success',
                    i18nkey: 'settingsUser.successInvite',
                })
            )

            return dispatch({
                type: USER_INVITE_ADD,
                payload: {
                    ...invite,
                    id: docRef.id,
                    createdAt: nowTimestamp(),
                    updatedAt: nowTimestamp(),
                },
            })
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)
            dispatch(
                addNotification({
                    type: 'error',
                    i18nkey: 'settingsUser.errorInvite',
                    message: `${userEmail}, ${JSON.stringify(error)}`,
                })
            )
            return false
        })
}

export const setUsersFilter = (filterValue) => ({
    type: USERS_SET_FILTER,
    payload: filterValue.trim(),
})

let stopListenForInvite
export const listenForInvite = (inviteId, history) => (dispatch) => {
    stopListenForInvite = fireStoreMainInstance
        .collection('projects-invites')
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
                        history.push(history.location.pathname + data.projectId)
                    }
                } else {
                    dispatch(
                        addNotification({
                            type: 'error',
                            i18nkey: 'settingsUser.invitationGetFail',
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
                        i18nkey: 'settingsUser.invitationGetFail',
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
        .collection('projects-invites')
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
                    i18nkey: 'settingsUser.errorPendingInvitesFailed',
                    message: `${JSON.stringify(error)}`,
                })
            )
            return false
        })
}

export const cancelInvite = (inviteId) => (dispatch) => {
    fireStoreMainInstance
        .collection('projects-invites')
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
                    i18nkey: 'settingsUser.cancelInviteFail',
                    message: `${JSON.stringify(error)}`,
                })
            )
            return false
        })
}
