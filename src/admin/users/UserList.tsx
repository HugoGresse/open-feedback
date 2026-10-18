import { useSelector } from 'react-redux'
import { UserItem } from './UserItem.tsx'
import { getUserSelector } from '../auth/authSelectors'

export const UserList = ({ userIds, ownerId, userTypes }) => {
    const loggedInUserId = useSelector(getUserSelector).uid

    return (
        <ul>
            {userIds.map(({ userId, role }) => {
                return (
                    <UserItem
                        userId={userId}
                        key={userId}
                        ownerId={ownerId}
                        currentUserId={loggedInUserId}
                        role={role}
                        userTypes={userTypes}
                    />
                )
            })}
        </ul>
    )
}
