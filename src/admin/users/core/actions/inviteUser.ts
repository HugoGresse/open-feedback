import type {
    Invite,
    InviteStatus,
    Organization,
    Project,
} from '../../../../core/models'
import type { AppThunk } from '../../../../store'
import { getPendingInvitesSelector } from '../usersSelectors'
import { addNotification } from '../../../notification/notifcationActions'
import { getUserSelector } from '../../../auth/authSelectors'
import { getSelectedProjectSelector } from '../../../project/core/projectSelectors'
import {
    fireStoreMainInstance,
    nowTimestamp,
    serverTimestamp,
} from '../../../../firebase.ts'
import { getDataFromProviderDataOrUser } from '../../../auth/authActions'
import { USER_INVITE_ADD, type UsersAction } from '../usersActionTypes'
import { getSelectedOrganizationSelector } from '../../../organization/core/organizationSelectors'

export const INVITE_TYPE_ORGANIZATION = 'organization'
export const INVITE_TYPE_PROJECT = 'project'

export type InviteType =
    | typeof INVITE_TYPE_ORGANIZATION
    | typeof INVITE_TYPE_PROJECT

/**
 * Resolves `false` on failure, the dispatched USER_INVITE_ADD action otherwise.
 */
export const inviteUser =
    (
        userEmail: string,
        userType: string,
        inviteType: InviteType
    ): AppThunk<Promise<UsersAction | false>> =>
    (dispatch, getState) => {
        const state = getState()
        // Firebase Auth emails are lowercase, and the rules and functions
        // match the invite email exactly.
        const destinationEmail = userEmail.trim().toLowerCase()

        const pendingInvites = getPendingInvitesSelector(state)
        if (
            pendingInvites.filter(
                (invite) =>
                    invite.destinationUserInfo.toLowerCase() ===
                    destinationEmail
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
        if (!currentUser) {
            throw new TypeError('inviteUser: no logged in user')
        }
        const project = getSelectedProjectSelector(state)
        const organization = getSelectedOrganizationSelector(state)
        const status: InviteStatus = 'new'
        const invite = {
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            destinationUserInfo: destinationEmail,
            originUserId: currentUser.uid,
            originUserName: currentUser.displayName,
            originUserPhotoURL: getDataFromProviderDataOrUser(
                currentUser,
                'photoURL'
            ),
            status,
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

                const addedInvite: Invite = {
                    ...invite,
                    id: docRef.id,
                    createdAt: nowTimestamp(),
                    updatedAt: nowTimestamp(),
                }
                const action: UsersAction = {
                    type: USER_INVITE_ADD,
                    payload: addedInvite,
                }
                return dispatch(action)
            })
            .catch((error: unknown) => {
                // biome-ignore lint/suspicious/noConsole: intentional log
                console.error(error)
                dispatch(
                    addNotification({
                        type: 'error',
                        i18nkey: 'users.errorInvite',
                        message: `${userEmail}, ${JSON.stringify(error)}`,
                    })
                )
                return false as const
            })
    }

const getInviteTarget = (
    inviteType: InviteType,
    userType: string,
    project: Pick<Project, 'id' | 'name'> | null | undefined,
    organization: Pick<Organization, 'id' | 'name'> | null | undefined
) => {
    switch (inviteType) {
        case INVITE_TYPE_PROJECT:
            if (!project) {
                throw new TypeError('inviteUser: no selected project')
            }
            return {
                projectId: project.id,
                projectName: project.name,
            }
        case INVITE_TYPE_ORGANIZATION:
            if (!organization) {
                throw new TypeError('inviteUser: no selected organization')
            }
            return {
                organizationName: organization.name,
                organizationId: organization.id,
                role: userType,
            }
        default:
            throw new Error('Unknown inviteType to invite user')
    }
}
