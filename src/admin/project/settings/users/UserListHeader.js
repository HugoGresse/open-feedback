import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getUsersFilterSelector} from './usersSelectors'
import {inviteUser, setUsersFilter} from './usersActions'
import OFListHeader from '../../../baseComponents/layouts/OFListHeader'

const UserListHeader = () => {
    const dispatch = useDispatch()
    const filter = useSelector(getUsersFilterSelector)

    return <OFListHeader
        filterValue={filter}
        filterChange={value => dispatch(setUsersFilter(value))}
        buttonProcessing={false}
        buttonClick={() => dispatch(inviteUser())}
        buttonText="Add a member"
    />

}


export default UserListHeader
