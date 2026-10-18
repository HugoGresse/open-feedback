import { useEffect } from 'react'
import { OFCard } from '../../../baseComponents/OFCard.tsx'
import { UserList } from '../../../users/UserList.tsx'
import { UserListHeader } from '../../../users/UserListHeader.tsx'
import { UserInviteList } from '../../../users/UserInviteList.tsx'
import { useAppDispatch, useAppSelector } from '../../../../store'
import {
    getUserDetails,
    setUsersFilter,
} from '../../../users/core/actions/usersActions'
import {
    INVITE_TYPE_PROJECT,
    inviteUser,
} from '../../../users/core/actions/inviteUser'
import { getMemberIds, getOwnerId } from '../../core/projectSelectors'
import { PROJECT_USER_ROLE_MEMBER } from './ProjectUserRoles.tsx'
import { getProjectOrganizationIfPossible } from '../../core/actions/getProjectOrganizationIfPossible'
import { getOrganizationMembersIdsSelector } from '../../../organization/core/organizationSelectors'
import { getFilteredUsersWithoutCurrentOneSelector } from '../../../users/core/usersSelectors'

export const ProjectUsers = () => {
    const dispatch = useAppDispatch()
    const userIds = useAppSelector(getMemberIds)
    const ownerId = useAppSelector(getOwnerId)
    const organizationUserIds = useAppSelector(
        getOrganizationMembersIdsSelector
    )
    const usersDetails = useAppSelector(
        getFilteredUsersWithoutCurrentOneSelector
    )

    useEffect(() => {
        organizationUserIds.forEach((userId) => {
            dispatch(getUserDetails(userId))
        })
    }, [organizationUserIds, dispatch])

    return (
        <OFCard>
            <UserListHeader
                onFilterChange={(value) => dispatch(setUsersFilter(value))}
                userTypes={[PROJECT_USER_ROLE_MEMBER]}
                onUserInvite={(email, type) =>
                    dispatch(inviteUser(email, type, INVITE_TYPE_PROJECT))
                }
                onSidePanelOpen={() => {
                    dispatch(getProjectOrganizationIfPossible())
                }}
                usersDetails={usersDetails}
            />
            <UserList userIds={userIds} ownerId={ownerId} userTypes={[]} />
            <UserInviteList />
        </OFCard>
    )
}
