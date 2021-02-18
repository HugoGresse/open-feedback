import React from 'react'
import OFCard from '../../../baseComponents/OFCard'
import UserList from '../../../users/UserList'
import UserListHeader from '../../../users/UserListHeader'
import UserInviteList from '../../../users/UserInviteList'
import { useDispatch } from 'react-redux'
import { setUsersFilter } from '../../../users/core/actions/usersActions'
import { PROJECT_USER_TYPES } from '../../../users/core/usersActionTypes'
import {
    INVITE_TYPE_PROJECT,
    inviteUser,
} from '../../../users/core/actions/inviteUser'

const Users = () => {
    const dispatch = useDispatch()

    return (
        <OFCard>
            <UserListHeader
                onFilterChange={(value) => dispatch(setUsersFilter(value))}
                onUserInvite={(email, type) =>
                    dispatch(inviteUser(email, type, INVITE_TYPE_PROJECT))
                }
                userTypes={PROJECT_USER_TYPES}
            />
            <UserList />
            <UserInviteList />
        </OFCard>
    )
}
export default Users
