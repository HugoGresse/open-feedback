import { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import { Box, Button } from '@mui/material'
import {
    getInviteReadErrorSelector,
    getInviteSelector,
} from './core/usersSelectors'
import { getUserSelector } from '../auth/authSelectors'
import { signOut } from '../auth/authActions'
import {
    getInviteDialogStatus,
    type InviteDialogStatus,
} from './core/getInviteDialogStatus'
import { useTranslation } from 'react-i18next'
import {
    listenForInvite,
    unsubscribeRealtimeInviteListener,
} from './core/actions/inviteListener'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'

const PENDING_STATUSES: InviteDialogStatus[] = ['loading', 'processing']

const STATUS_TEXT_KEYS: Record<
    Exclude<InviteDialogStatus, 'wrongAccount'>,
    string | null
> = {
    loading: null,
    processing: 'users.inviteCompleted',
    failed: 'users.inviteFailed',
    unavailable: 'users.invitationGetFail',
}

export interface InviteDialogProps {
    inviteId: string
}

export const InviteDialog = ({ inviteId }: InviteDialogProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const invite = useAppSelector(getInviteSelector)
    const readError = useAppSelector(getInviteReadErrorSelector)
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

    const status = getInviteDialogStatus(invite, readError, currentUser)
    const pending = PENDING_STATUSES.includes(status)
    const text =
        status === 'wrongAccount'
            ? t('users.inviteWrongAccount', {
                  account: currentUser?.email || currentUser?.phoneNumber,
              })
            : STATUS_TEXT_KEYS[status] && t(STATUS_TEXT_KEYS[status])

    return (
        <Dialog
            onClose={() => closeDialog()}
            aria-labelledby="event invitation"
            open={!!inviteId}
        >
            <DialogTitle>{t('users.invitation')}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {text}
                </DialogContentText>
                {pending && (
                    <Box margin={2}>
                        <CircularProgress />
                    </Box>
                )}
            </DialogContent>
            {status === 'wrongAccount' && (
                <DialogActions>
                    <Button onClick={() => closeDialog()}>
                        {t('users.inviteGoToDashboard')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => dispatch(signOut())}
                    >
                        {t('users.inviteLogout')}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    )
}
