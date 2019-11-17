import {getAdminStateSelector} from '../../../adminSelector'
import {createSelector} from 'reselect'

const getUsersState = state => getAdminStateSelector(state).adminUsers

export const getUsersSelector = state => getUsersState(state).usersData

export const getUsersFilterSelector = state => getUsersState(state).filter

export const getFilteredUsersSelector = createSelector(
    getUsersSelector,
    getUsersFilterSelector,
    (userDetails, filter) => {
        const userDetailsArray = Object.values(userDetails)
        if(!filter || userDetailsArray.length === 0) {
            return userDetails
        }

        const result = {}
        userDetailsArray.forEach(userDetail => {
            const displayNameMatch = userDetail.displayName && userDetail.displayName.includes(filter)
            const emailMatch = userDetail.email && userDetail.email.includes(filter)
            if(displayNameMatch || emailMatch) {
                result[userDetail.uid] = userDetail
            }
        })
        return result
    }
)
