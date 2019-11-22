import React from 'react'
import OFCard from '../../../baseComponents/OFCard'
import UserList from './UserList'
import UserListHeader from './UserListHeader'
import UserInviteList from './UserInviteList'

const Users = () => {
    return <OFCard>
        <UserListHeader/>
        <UserList/>
        <UserInviteList/>
    </OFCard>
}
export default Users
