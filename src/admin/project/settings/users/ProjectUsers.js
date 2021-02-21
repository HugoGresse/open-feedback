import React from 'react'
import OFCard from '../../../baseComponents/OFCard'
import UserList from '../../../users/UserList'
import UserListHeader from '../../../users/UserListHeader'
import UserInviteList from '../../../users/UserInviteList'
import { useDispatch, useSelector } from 'react-redux'
import { setUsersFilter } from '../../../users/core/actions/usersActions'
import {
    INVITE_TYPE_PROJECT,
    inviteUser,
} from '../../../users/core/actions/inviteUser'
import { getMemberIds, getOwnerId } from '../../core/projectSelectors'
import { PROJECT_USER_ROLE_MEMBER } from './ProjectUserRoles'

const ProjectUsers = () => {
    const dispatch = useDispatch()
    const userIds = useSelector(getMemberIds)
    const ownerId = useSelector(getOwnerId)

    return (
        <OFCard>
            <UserListHeader
                onFilterChange={(value) => dispatch(setUsersFilter(value))}
                onUserInvite={(email, type) =>
                    dispatch(inviteUser(email, type, INVITE_TYPE_PROJECT))
                }
                userTypes={[PROJECT_USER_ROLE_MEMBER]}
            />
            <UserList userIds={userIds} ownerId={ownerId} userTypes={[]} />
            <UserInviteList />
        </OFCard>
    )
}
export default ProjectUsers
