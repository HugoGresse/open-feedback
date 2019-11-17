import React from 'react'
import OFCard from '../../../baseComponents/OFCard'
import UserList from './UserList'
import UserListHeader from './UserListHeader'

const Users = () => {
    return <OFCard>
        <UserListHeader/>
        <UserList/>
    </OFCard>
}
export default Users
