import {useDispatch, useSelector} from 'react-redux'
import React, {useEffect} from 'react'
import Box from '@material-ui/core/Box'
import {Typography} from '@material-ui/core'
import {cancelInvite, getPendingInvites} from './usersActions'
import {getPendingInvitesSelector} from './usersSelectors'
import UserInviteItem from './UserInviteItem'

const UserInviteList = () => {
    const dispatch = useDispatch()
    const pendingInvites = useSelector(getPendingInvitesSelector)

    useEffect(() => {
        dispatch(getPendingInvites())
    }, [dispatch])

    return <Box>
        <Typography variant="h6" style={{marginTop: 20, marginLeft: 32, marginBottom: 10}}>PENDING INVITES</Typography>
        {pendingInvites.map(invite => <UserInviteItem key={invite.id}
                                                      invite={invite}
                                                      cancelInvite={(inviteId) => dispatch(cancelInvite(inviteId))}/>
        )}
    </Box>
}

export default UserInviteList
