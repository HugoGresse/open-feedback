import { getAdminStateSelector } from '../../adminSelector'
import { createSelector } from 'reselect'
import { getUserIdSelector } from '../../auth/authSelectors'

const getUsersState = (state) => getAdminStateSelector(state).adminUsers

export const getUsersSelector = (state) => getUsersState(state).usersData

export const getUsersFilterSelector = (state) => getUsersState(state).filter

export const getFilteredUsersSelector = createSelector(
    getUsersSelector,
    getUsersFilterSelector,
    (userDetails, filter) => {
        const userDetailsArray = Object.values(userDetails)
        if (!filter || userDetailsArray.length === 0) {
            return userDetails
        }

        const result = {}
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

export const getFilteredUsersWithoutCurrentOneSelector = createSelector(
    getFilteredUsersSelector,
    getUserIdSelector,
    (users, currentUserId) =>
        Object.keys(users).reduce((acc, userId) => {
            if (userId === currentUserId) {
                return acc
            }
            acc[userId] = users[userId]
            return acc
        }, {})
)

export const getInviteSelector = (state) => getUsersState(state).invite

export const getPendingInvitesSelector = (state) =>
    getUsersState(state).pendingInvites
