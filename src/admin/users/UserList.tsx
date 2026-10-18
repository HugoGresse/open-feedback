import { UserItem } from './UserItem.tsx'
import { getUserIdSelector } from '../auth/authSelectors'
import { useAppSelector } from '../../store'

/** A member of an event or organization with its role. */
export interface UserMember {
    userId: string
    role: string
}

export interface UserListProps {
    userIds: readonly UserMember[]
    ownerId: string
    /** Roles that can be picked, empty when the role cannot be changed. */
    userTypes: readonly string[]
}

export const UserList = ({ userIds, ownerId, userTypes }: UserListProps) => {
    const loggedInUserId = useAppSelector(getUserIdSelector)

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
