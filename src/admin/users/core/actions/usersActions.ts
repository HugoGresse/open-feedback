import {
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore'
import type { Invite, User } from '../../../../core/models'
import type { AppThunk } from '../../../../store'
import { fireStoreMainInstance } from '../../../../firebase.ts'
import {
    GET_USER_DETAILS_SUCCESS,
    USER_INVITE_HIDE,
    USER_INVITE_REMOVE_SUCCESS,
    USER_INVITES_GET_SUCCESS,
    USER_INVITES_LISTEN,
    USERS_SET_FILTER,
    type UsersAction,
} from '../usersActionTypes'
import { getListedInvitesSelector, getUsersSelector } from '../usersSelectors'
import { hasJustAccepted } from '../usersReducer'
import { getProject } from '../../../project/core/actions/getProject'
import { getOrganization } from '../../../organization/core/actions/getOrganization'
import {
    getMemberIds,
    getSelectedProjectIdSelector,
    getSelectedProjectSelector,
} from '../../../project/core/projectSelectors'
import { addNotification } from '../../../notification/notifcationActions'
import { editProject } from '../../../project/core/actions/editProject'
import {
    getSelectedOrganizationIdSelector,
    getSelectedOrganizationSelector,
} from '../../../organization/core/organizationSelectors'
import {
    editOrganization,
    type EditOrganizationData,
} from '../../../organization/core/actions/editOrganization'
import {
    ORGANIZATION_EXISTING_USER_ROLES,
    ORGANIZATION_NEW_USER_ROLES,
    ORGANIZATION_ROLE_ID,
    ORGANIZATION_USER_ROLE_OWNER,
} from '../../../organization/core/organizationConstants'

export const getUserDetails =
    (uid: string): AppThunk<Promise<void> | undefined> =>
    (dispatch, getState) => {
        const usersDetails = getUsersSelector(getState())

        if (usersDetails && usersDetails[uid]) {
            // prevent load if data are already there
            return
        }

        return getDoc(doc(fireStoreMainInstance, 'users', uid))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    dispatch({
                        type: GET_USER_DETAILS_SUCCESS,
                        payload: snapshot.data() as User,
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
            .catch((error: unknown) => {
                // biome-ignore lint/suspicious/noConsole: intentional log
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

export const removeUser =
    (userIdToRemove: string, role: string): AppThunk<Promise<void>> =>
    (dispatch, getState) => {
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
                    ORGANIZATION_EXISTING_USER_ROLES.slice(
                        0,
                        roleIndex + 1
                    ).reduce<EditOrganizationData>((acc, role) => {
                        acc[ORGANIZATION_ROLE_ID[role]] =
                            arrayRemove(userIdToRemove)
                        return acc
                    }, {})
                )
            )
        }

        throw new Error('Unknown action to remove user')
    }

export const changeUserRole =
    (userId: string, oldRole: string, newRole: string): AppThunk =>
    (dispatch, getState) => {
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
                ).reduce<EditOrganizationData>((acc, role) => {
                    acc[ORGANIZATION_ROLE_ID[role]] = arrayUnion(userId)
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
                        ).reduce<EditOrganizationData>((acc, role) => {
                            acc[ORGANIZATION_ROLE_ID[role]] =
                                arrayRemove(userId)
                            return acc
                        }, {})
                    )
                )
            }

            return
        }

        throw new Error('Unknown action to change user role')
    }

export const setUsersFilter = (filterValue: string): UsersAction => ({
    type: USERS_SET_FILTER,
    payload: filterValue.trim(),
})

/**
 * Listens to all the invites of the project, or else of the organization, not
 * only the pending ones, to see when one is accepted. Returns the unsubscribe.
 */
export const listenForInvites =
    (
        projectId: string | null | undefined,
        organizationId: string | null | undefined
    ): AppThunk<(() => void) | undefined> =>
    (dispatch, getState) => {
        dispatch({ type: USER_INVITES_LISTEN })
        const whereKey = projectId ? 'projectId' : 'organizationId'
        const orgIdOrProjectId = projectId || organizationId
        if (!orgIdOrProjectId) {
            return
        }

        return onSnapshot(
            query(
                collection(fireStoreMainInstance, 'invites'),
                where(whereKey, '==', orgIdOrProjectId)
            ),
            (querySnapshot) => {
                const invites = querySnapshot.docs.map(
                    (snapshot) =>
                        ({
                            id: snapshot.id,
                            // A just created invite has its timestamps
                            // pending, null otherwise
                            ...snapshot.data({
                                serverTimestamps: 'estimate',
                            }),
                        }) as Invite
                )
                const listed = getListedInvitesSelector(getState())
                dispatch({
                    type: USER_INVITES_GET_SUCCESS,
                    payload: invites,
                })
                if (hasJustAccepted(listed, invites)) {
                    dispatch(refreshMembers(projectId, organizationId))
                }
            },
            (error: unknown) => {
                // biome-ignore lint/suspicious/noConsole: intentional log
                console.error(error)
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'users.errorPendingInvitesFailed',
                        message: `${JSON.stringify(error)}`,
                    })
                )
            }
        )
    }

/** The members are read once: shows the one who just accepted an invite. */
const refreshMembers =
    (
        projectId: string | null | undefined,
        organizationId: string | null | undefined
    ): AppThunk =>
    (dispatch, getState) => {
        if (projectId) {
            // getProject also reads the organization when it is not loaded,
            // denied to event members who are not in it: do not repeat its
            // error on each acceptance.
            const state = getState()
            if (
                getSelectedProjectSelector(state)?.organizationId &&
                !getSelectedOrganizationSelector(state)
            ) {
                return
            }
            dispatch(getProject(projectId))
        } else if (organizationId) {
            dispatch(getOrganization(organizationId))
        }
    }

/** Removes an accepted invite from the list, once shown as accepted. */
export const hideInvite = (inviteId: string): UsersAction => ({
    type: USER_INVITE_HIDE,
    payload: inviteId,
})

export const cancelInvite =
    (inviteId: string): AppThunk =>
    (dispatch) => {
        deleteDoc(doc(fireStoreMainInstance, 'invites', inviteId))
            .then(() =>
                dispatch({
                    type: USER_INVITE_REMOVE_SUCCESS,
                    payload: inviteId,
                })
            )
            .catch((error: unknown) => {
                // biome-ignore lint/suspicious/noConsole: intentional log
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
