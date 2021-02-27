import { getPendingInvitesSelector } from '../usersSelectors'
import { addNotification } from '../../../notification/notifcationActions'
import { getUserSelector } from '../../../auth/authSelectors'
import { getSelectedProjectSelector } from '../../../project/core/projectSelectors'
import {
    fireStoreMainInstance,
    nowTimestamp,
    serverTimestamp,
} from '../../../../firebase'
import { getDataFromProviderDataOrUser } from '../../../auth/authActions'
import { USER_INVITE_ADD } from '../usersActionTypes'
import { getSelectedOrganizationSelector } from '../../../organization/core/organizationSelectors'

export const INVITE_TYPE_ORGANIZATION = 'organization'
export const INVITE_TYPE_PROJECT = 'project'

export const inviteUser = (userEmail, userType, inviteType) => (
    dispatch,
    getState
) => {
    const state = getState()

    const pendingInvites = getPendingInvitesSelector(state)
    if (
        pendingInvites.filter(
            (invite) => invite.destinationUserInfo === userEmail
        ).length > 0
    ) {
        dispatch(
            addNotification({
                type: 'error',
                i18nkey: 'users.errorUserAlreadyInvited',
            })
        )
        return Promise.resolve(false)
    }

    const currentUser = getUserSelector(state)
    const project = getSelectedProjectSelector(state)
    const organization = getSelectedOrganizationSelector(state)
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
        status: 'new',
        ...getInviteTarget(inviteType, userType, project, organization),
    }

    return fireStoreMainInstance
        .collection('invites')
        .add(invite)
        .then((docRef) => {
            dispatch(
                addNotification({
                    type: 'success',
                    i18nkey: 'users.successInvite',
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
                    i18nkey: 'users.errorInvite',
                    message: `${userEmail}, ${JSON.stringify(error)}`,
                })
            )
            return false
        })
}

const getInviteTarget = (inviteType, userType, project, organization) => {
    switch (inviteType) {
        case INVITE_TYPE_PROJECT:
            return {
                projectId: project.id,
                projectName: project.name,
            }
        case INVITE_TYPE_ORGANIZATION:
            return {
                organizationName: organization.name,
                organizationId: organization.id,
                role: userType,
            }
        default:
            throw new Error('Unknown inviteType to invite user')
    }
}
