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
import { getUserSelector } from '../../auth/authSelectors'

/**
 * This is a WIP and has been merged to reduce review overflow
 *
 * Missing part:
 * 1. make users a separate folder and try to make it generic for project and orgs
 * 2. Display users from org
 * 3. Manage more roles
 * 4. Add roles guides/explanation.
 * @returns {JSX.Element}
 * @constructor
 */
export const OrganizationUsers = () => {
    const dispatch = useDispatch()
    const ownerUserId = useSelector(getOrganizationOwnerIdSelector)
    const loggedInUserId = useSelector(getUserSelector).id
    const membersUserIds = useSelector(getOrganizationMembersIdsSelector)
    return (
        <>
            <div>
                Organization are work in progress and has been merged to prevent
                review overflow. While voting form and theme are not currently
                working, organizations user roles are available directly within
                the DB.
            </div>
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
        </>
    )
}
