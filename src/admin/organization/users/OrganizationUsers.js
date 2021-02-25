import React from 'react'
import UserListHeader from '../../users/UserListHeader'
import { setUsersFilter } from '../../users/core/actions/usersActions'
import { useDispatch, useSelector } from 'react-redux'
import {
    INVITE_TYPE_ORGANIZATION,
    inviteUser,
} from '../../users/core/actions/inviteUser'
import UserList from '../../users/UserList'
import {
    getOrganizationMembersIdsSelector,
    getOrganizationOwnerIdSelector,
} from '../core/organizationSelectors'
import {
    ORGANIZATION_EXISTING_USER_ROLES,
    ORGANIZATION_NEW_USER_ROLES,
} from '../core/organizationConstants'
import UserInviteList from '../../users/UserInviteList'

/**
 * This is a WIP and has been merged to reduce review overflow
 *
 * Missing part:
 * 4. Add roles guides/explanation.
 */
export const OrganizationUsers = () => {
    const dispatch = useDispatch()
    const ownerUserId = useSelector(getOrganizationOwnerIdSelector)
    const membersUserIds = useSelector(getOrganizationMembersIdsSelector)
    return (
        <>
            <UserListHeader
                onFilterChange={(value) => dispatch(setUsersFilter(value))}
                onUserInvite={(email, type) =>
                    dispatch(inviteUser(email, type, INVITE_TYPE_ORGANIZATION))
                }
                userTypes={ORGANIZATION_NEW_USER_ROLES}
            />
            <UserList
                ownerId={ownerUserId}
                userIds={membersUserIds}
                userTypes={ORGANIZATION_EXISTING_USER_ROLES}
            />
            <UserInviteList />
        </>
    )
}
