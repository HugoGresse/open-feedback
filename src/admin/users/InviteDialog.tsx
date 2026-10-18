import { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import CircularProgress from '@mui/material/CircularProgress'
import { Box } from '@mui/material'
import { isEmpty } from 'lodash'
import { getInviteSelector } from './core/usersSelectors'
import { getUserSelector } from '../auth/authSelectors'
import { useTranslation } from 'react-i18next'
import {
    listenForInvite,
    unsubscribeRealtimeInviteListener,
} from './core/actions/inviteListener'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'

export interface InviteDialogProps {
    inviteId: string
}

export const InviteDialog = ({ inviteId }: InviteDialogProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const invite = useAppSelector(getInviteSelector)
    // Was the loaded users map (getUsersSelector), whose email/phoneNumber are
    // always undefined: the dialog closed as soon as the invite was loaded,
    // even for the invited user.
    const currentUser = useAppSelector(getUserSelector)
    const { t } = useTranslation()

    useEffect(() => {
        dispatch(listenForInvite(inviteId, navigate))
        return () => {
            dispatch(unsubscribeRealtimeInviteListener())
        }
    }, [dispatch, inviteId, navigate])

    const closeDialog = () => {
        navigate(window.location.pathname)
    }

    let text = ''
    if (invite) {
        if (
            invite.destinationUserInfo &&
            invite.destinationUserInfo !== currentUser?.email &&
            invite.destinationUserInfo !== currentUser?.phoneNumber
        ) {
            navigate(window.location.pathname)
        }
        if (invite.status === 'emailSent') {
            text = t('users.inviteCompleted')
        }
    } else {
        text = t('users.inviteAlreadyUsed')
    }

    return (
        <Dialog
            onClose={() => closeDialog()}
            aria-labelledby="event invitation"
            open={!isEmpty(inviteId)}
        >
            <DialogTitle>Event invitation</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {text}
                </DialogContentText>
                <Box margin={2}>
                    <CircularProgress />
                </Box>
            </DialogContent>
        </Dialog>
    )
}
