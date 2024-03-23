import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import { cancelInvite, getPendingInvites } from './core/actions/usersActions'
import { getPendingInvitesSelector } from './core/usersSelectors'
import UserInviteItem from './UserInviteItem.jsx'
import TranslatedTypography from '../baseComponents/TranslatedTypography.jsx'

const UserInviteList = () => {
    const dispatch = useDispatch()
    const pendingInvites = useSelector(getPendingInvitesSelector)

    useEffect(() => {
        dispatch(getPendingInvites())
    }, [dispatch])

    if (pendingInvites.length === 0) {
        return ''
    }

    return (
        <Box>
            <TranslatedTypography
                variant="h6"
                style={{ marginTop: 20, marginLeft: 32, marginBottom: 10 }}
                i18nKey="users.invites">
                PENDING INVITES
            </TranslatedTypography>
            {pendingInvites.map((invite) => (
                <UserInviteItem
                    key={invite.id}
                    invite={invite}
                    cancelInvite={(inviteId) =>
                        dispatch(cancelInvite(inviteId))
                    }
                />
            ))}
        </Box>
    )
}

export default UserInviteList
