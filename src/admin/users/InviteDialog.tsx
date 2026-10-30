import { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import { Box } from '@mui/material'
import { getInviteSelector } from './core/usersSelectors'
import { getUserSelector } from '../auth/authSelectors'
import { getDataFromProviderDataOrUser, signOut } from '../auth/authActions'
import { getInviteDialogStatus } from './core/getInviteDialogStatus'
import { useTranslation } from 'react-i18next'
import {
    listenForInvite,
    unsubscribeRealtimeInviteListener,
} from './core/actions/inviteListener'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'
import { OFButton } from '../baseComponents/button/OFButton.tsx'

export interface InviteDialogProps {
    inviteId: string
}

export const InviteDialog = ({ inviteId }: InviteDialogProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const invite = useAppSelector(getInviteSelector)
    const currentUser = useAppSelector(getUserSelector)
    const { t } = useTranslation()

    useEffect(() => {
        dispatch(listenForInvite(inviteId, navigate))
        return () => {
            dispatch(unsubscribeRealtimeInviteListener())
        }
    }, [dispatch, inviteId, navigate])

    const closeDialog = () => {
        navigate(window.location.pathname, { replace: true })
    }

    const status = getInviteDialogStatus(invite)
    const account =
        getDataFromProviderDataOrUser(currentUser, 'email') ||
        getDataFromProviderDataOrUser(currentUser, 'phoneNumber') ||
        currentUser?.displayName
    const text = {
        loading: '',
        processing: t('users.inviteCompleted'),
        failed: t('users.inviteFailed'),
        wrongAccount: t('users.inviteWrongAccount', { account }),
        unavailable: t('users.invitationGetFail'),
    }[status]
    const pending = status === 'loading' || status === 'processing'

    return (
        <Dialog onClose={() => closeDialog()} open={!!inviteId}>
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
                    <OFButton
                        onClick={() => closeDialog()}
                        style={{ design: 'text' }}
                    >
                        {t('common.close')}
                    </OFButton>
                    <OFButton onClick={() => dispatch(signOut())}>
                        {t('users.inviteLogout')}
                    </OFButton>
                </DialogActions>
            )}
        </Dialog>
    )
}
