import { useSelector } from 'react-redux'
import { getMemberIds, getOwnerId } from '../project/core/projectSelectors'
import UserItem from './UserItem'
import React from 'react'
import { getUserSelector } from '../auth/authSelectors'

const UserList = () => {
    const userIds = useSelector(getMemberIds)
    const ownerId = useSelector(getOwnerId)
    const loggedInUserId = useSelector(getUserSelector).uid

    return userIds.map((uid) => (
        <UserItem
            userId={uid}
            key={uid}
            ownerId={ownerId}
            currentUserId={loggedInUserId}
        />
    ))
}

export default UserList
