import React, { useEffect } from 'react'
import OFCard from '../../../baseComponents/OFCard'
import UserList from '../../../users/UserList'
import UserListHeader from '../../../users/UserListHeader'
import UserInviteList from '../../../users/UserInviteList'
import { useDispatch, useSelector } from 'react-redux'
import {
    getUserDetails,
    setUsersFilter,
} from '../../../users/core/actions/usersActions'
import {
    INVITE_TYPE_PROJECT,
    inviteUser,
} from '../../../users/core/actions/inviteUser'
import { getMemberIds, getOwnerId } from '../../core/projectSelectors'
import { PROJECT_USER_ROLE_MEMBER } from './ProjectUserRoles'
import { getProjectOrganizationIfPossible } from '../../core/actions/getProjectOrganizationIfPossible'
import { getOrganizationMembersIdsSelector } from '../../../organization/core/organizationSelectors'
import { getFilteredUsersWithoutCurrentOneSelector } from '../../../users/core/usersSelectors'

const ProjectUsers = () => {
    const dispatch = useDispatch()
    const userIds = useSelector(getMemberIds)
    const ownerId = useSelector(getOwnerId)
    const organizationUserIds = useSelector(getOrganizationMembersIdsSelector)
    const usersDetails = useSelector(getFilteredUsersWithoutCurrentOneSelector)

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
export default ProjectUsers
