import {fireStoreMainInstance, nowTimestamp, serverTimestamp} from '../../../../firebase'
import {ADD_NOTIFICATION} from '../../../notification/notificationActionTypes'
import {
    GET_USER_DETAILS_SUCCESS, USER_INVITE_ADD,
    USER_INVITE_GET_SUCCESS, USER_INVITE_REMOVE_SUCCESS,
    USER_INVITES_GET_SUCCESS,
    USERS_SET_FILTER
} from './usersActionTypes'
import {getPendingInvitesSelector, getUsersSelector} from './usersSelectors'
import {editProject} from '../../core/projectActions'
import {getMemberIds, getSelectedProjectIdSelector, getSelectedProjectSelector} from '../../core/projectSelectors'
import {getUserSelector} from '../../../auth/authSelectors'
import {getDataFromProviderDataOrUser} from '../../../auth/authActions'
import {history} from '../../../../App'

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
    const pendingInvites = getPendingInvitesSelector(getState())
    if(pendingInvites.filter(invite => invite.destinationUserInfo === userEmail)) {
        dispatch({
            type: ADD_NOTIFICATION,
            payload: {
                type: 'error',
                message: 'The user is already invited to the event.'
            }
        })
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
        originUserPhotoURL: getDataFromProviderDataOrUser(currentUser, 'photoURL'),
        projectId: project.id,
        projectName: project.name,
        status: 'new'
    }

    return fireStoreMainInstance
        .collection('projects-invites')
        .add(invite)
        .then(docRef => {
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'success',
                    message: `The user has been invited to the project and should receive an email very soon.`
                }
            })

            return dispatch({
                type: USER_INVITE_ADD,
                payload: {
                    ...invite,
                    id: docRef.id,
                    createdAt: nowTimestamp(),
                    updatedAt: nowTimestamp()
                }
            })
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

let stopListenForInvite
export const listenForInvite = inviteId => dispatch => {
    stopListenForInvite = fireStoreMainInstance
        .collection('projects-invites')
        .doc(inviteId)
        .onSnapshot(snapshot => {
            if (snapshot.exists) {
                const data = snapshot.data()
                dispatch({
                    type: USER_INVITE_GET_SUCCESS,
                    payload: snapshot.data()
                })
                if (data.status === 'completed') {
                    history.push(history.location.pathname + data.projectId)
                }
            } else {
                dispatch({
                    type: ADD_NOTIFICATION,
                    payload: {
                        type: 'error',
                        message: `Unable to get your invitation, ask for another one please.`
                    }
                })
            }
        }, (error => {
            // eslint-disable-next-line no-console
            console.error(error)
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: `Unable to get your invitation, ask for another one please.`
                }
            })
            return false
        }))
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
        .then(querySnapshot => {
            const pendingInvite = []
            querySnapshot.forEach(snapshot => {
                pendingInvite.push({
                    id: snapshot.id,
                    ...snapshot.data()
                })
            })
            return dispatch({
                type: USER_INVITES_GET_SUCCESS,
                payload: pendingInvite
            })
        })
        .catch(error => {
            // eslint-disable-next-line no-console
            console.error(error)
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: `Failed to load pending invites, ${JSON.stringify(error)}`
                }
            })
            return false
        })
}

export const cancelInvite = (inviteId) => dispatch => {
    fireStoreMainInstance
        .collection('projects-invites')
        .doc(inviteId)
        .delete()
        .then(() => dispatch({
                type: USER_INVITE_REMOVE_SUCCESS,
                payload: inviteId
            })
        )
        .catch(error => {
            // eslint-disable-next-line no-console
            console.error(error)
            dispatch({
                type: ADD_NOTIFICATION,
                payload: {
                    type: 'error',
                    message: `Failed to cancel invite, ${JSON.stringify(error)}`
                }
            })
            return false
        })
}
