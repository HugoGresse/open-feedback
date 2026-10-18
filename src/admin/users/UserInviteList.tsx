import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { cancelInvite, getPendingInvites } from './core/actions/usersActions'
import { getPendingInvitesSelector } from './core/usersSelectors'
import { UserInviteItem } from './UserInviteItem.tsx'
import { TranslatedTypography } from '../baseComponents/TranslatedTypography.tsx'
import { useAppDispatch, useAppSelector } from '../../store'

export const UserInviteList = () => {
    const dispatch = useAppDispatch()
    const pendingInvites = useAppSelector(getPendingInvitesSelector)

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
                i18nKey="users.invites"
            >
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
