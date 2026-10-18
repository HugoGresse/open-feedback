import { UserListHeader } from '../../users/UserListHeader.tsx'
import { setUsersFilter } from '../../users/core/actions/usersActions'
import {
    INVITE_TYPE_ORGANIZATION,
    inviteUser,
} from '../../users/core/actions/inviteUser'
import { UserList } from '../../users/UserList.tsx'
import {
    getOrganizationMembersSelector,
    getOrganizationOwnerIdSelector,
} from '../core/organizationSelectors'
import {
    ORGANIZATION_EXISTING_USER_ROLES,
    ORGANIZATION_NEW_USER_ROLES,
} from '../core/organizationConstants'
import { UserInviteList } from '../../users/UserInviteList.tsx'
import { useAppDispatch, useAppSelector } from '../../../store'

export const OrganizationUsers = () => {
    const dispatch = useAppDispatch()
    const ownerUserId = useAppSelector(getOrganizationOwnerIdSelector)
    const membersUserIds = useAppSelector(getOrganizationMembersSelector)
    return (
        <div id="orgUsers">
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
        </div>
    )
}
