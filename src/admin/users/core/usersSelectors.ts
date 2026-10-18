import type { User } from '../../../core/models'
import type { RootState } from '../../../store'
import { createAppSelector } from '../../../store'
import { getAdminStateSelector } from '../../adminSelector'
import { getUserIdSelector } from '../../auth/authSelectors'

const getUsersState = (state: RootState) =>
    getAdminStateSelector(state).adminUsers

export const getUsersSelector = (state: RootState) =>
    getUsersState(state).usersData

export const getUsersFilterSelector = (state: RootState) =>
    getUsersState(state).filter

export const getFilteredUsersSelector = createAppSelector(
    [getUsersSelector, getUsersFilterSelector],
    (userDetails, filter) => {
        const userDetailsArray = Object.values(userDetails)
        if (!filter || userDetailsArray.length === 0) {
            return userDetails
        }

        const result: Record<string, User> = {}
        userDetailsArray.forEach((userDetail) => {
            const displayNameMatch =
                userDetail.displayName &&
                userDetail.displayName.includes(filter)
            const emailMatch =
                userDetail.email && userDetail.email.includes(filter)
            if (displayNameMatch || emailMatch) {
                result[userDetail.uid] = userDetail
            }
        })
        return result
    }
)

export const getFilteredUsersWithoutCurrentOneSelector = createAppSelector(
    [getFilteredUsersSelector, getUserIdSelector],
    (users, currentUserId) =>
        Object.keys(users).reduce<Record<string, User>>((acc, userId) => {
            if (userId === currentUserId) {
                return acc
            }
            acc[userId] = users[userId]
            return acc
        }, {})
)

export const getInviteSelector = (state: RootState) =>
    getUsersState(state).invite

export const getPendingInvitesSelector = (state: RootState) =>
    getUsersState(state).pendingInvites
