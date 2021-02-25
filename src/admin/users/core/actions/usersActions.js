import {
    arrayRemoveField,
    arrayUnionField,
    fireStoreMainInstance,
} from '../../../../firebase'
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
import { getSelectedOrganizationIdSelector } from '../../../organization/core/organizationSelectors'
import { editOrganization } from '../../../organization/core/actions/editOrganization'
import {
    ORGANIZATION_EXISTING_USER_ROLES,
    ORGANIZATION_NEW_USER_ROLES,
    ORGANIZATION_ROLE_ID,
    ORGANIZATION_USER_ROLE_OWNER,
} from '../../../organization/core/organizationConstants'

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

export const removeUser = (userIdToRemove, role) => (dispatch, getState) => {
    const state = getState()

    const selectedProjectId = getSelectedProjectIdSelector(state)
    const selectedOrganizationId = getSelectedOrganizationIdSelector(state)

    if (selectedProjectId) {
        const currentUsers = getMemberIds(state)
        return dispatch(
            editProject({
                members: currentUsers
                    .filter(({ userId }) => userId !== userIdToRemove)
                    .map(({ userId }) => userId),
            })
        )
    }

    if (selectedOrganizationId) {
        const roleIndex = ORGANIZATION_EXISTING_USER_ROLES.findIndex(
            (existingRole) => existingRole === role
        )
        return dispatch(
            editOrganization(
                ORGANIZATION_EXISTING_USER_ROLES.slice(0, roleIndex + 1).reduce(
                    (acc, role) => {
                        acc[ORGANIZATION_ROLE_ID[role]] = arrayRemoveField(
                            userIdToRemove
                        )
                        return acc
                    },
                    {}
                )
            )
        )
    }

    throw new Error('Unknown action to remove user')
}

export const changeUserRole = (userId, oldRole, newRole) => (
    dispatch,
    getState
) => {
    if (oldRole === newRole) {
        throw new Error('Role identical')
    }

    const state = getState()
    const selectedOrganizationId = getSelectedOrganizationIdSelector(state)
    if (selectedOrganizationId) {
        const newRoleIndex = ORGANIZATION_EXISTING_USER_ROLES.findIndex(
            (existingRole) => existingRole === newRole
        )
        const oldRoleIndex = ORGANIZATION_EXISTING_USER_ROLES.findIndex(
            (existingRole) => existingRole === oldRole
        )

        if (newRoleIndex > oldRoleIndex) {
            const changes = ORGANIZATION_NEW_USER_ROLES.slice(
                oldRoleIndex + 1,
                newRoleIndex + 1
            ).reduce((acc, role) => {
                acc[ORGANIZATION_ROLE_ID[role]] = arrayUnionField(userId)
                return acc
            }, {})
            if (newRole === ORGANIZATION_USER_ROLE_OWNER) {
                changes[ORGANIZATION_ROLE_ID[newRole]] = userId
            }
            dispatch(editOrganization(changes))
        } else {
            dispatch(
                editOrganization(
                    ORGANIZATION_NEW_USER_ROLES.slice(
                        newRoleIndex + 1,
                        oldRoleIndex + 1
                    ).reduce((acc, role) => {
                        acc[ORGANIZATION_ROLE_ID[role]] = arrayRemoveField(
                            userId
                        )
                        return acc
                    }, {})
                )
            )
        }

        return
    }

    throw new Error('Unknown action to change user role')
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
