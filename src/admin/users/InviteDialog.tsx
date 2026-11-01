import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box } from '@mui/material'
import { getInviteSelector } from './core/usersSelectors'
import { getUserSelector } from '../auth/authSelectors'
import { getDataFromProviderDataOrUser, signOut } from '../auth/authActions'
import {
    getInviteDestination,
    getInviteDestinationUrl,
    getInviteDialogStatus,
} from './core/getInviteDialogStatus'
import { useTranslation } from 'react-i18next'
import {
    listenForInvite,
    unsubscribeRealtimeInviteListener,
} from './core/actions/inviteListener'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store'
import { OFButton } from '../baseComponents/button/OFButton.tsx'
import { useQuery } from '../../utils/useQuery'

/**
 * Opens the invite dialog from the `?inviteId` of an invite link, and keeps it
 * open once the invite is accepted, as the redirect to the joined event drops
 * the query.
 */
export const InviteDialogFromUrl = () => {
    const navigate = useNavigate()
    const urlInviteId = useQuery().get('inviteId')
    const [inviteId, setInviteId] = useState(urlInviteId)
    if (urlInviteId && urlInviteId !== inviteId) {
        setInviteId(urlInviteId)
    }

    const close = (redirectTo?: string) => {
        if (redirectTo || urlInviteId) {
            navigate(redirectTo ?? window.location.pathname, { replace: true })
        }
        setInviteId(null)
    }

    if (!inviteId) {
        return null
    }
    return <InviteDialog inviteId={inviteId} onClose={close} />
}

const JOINED_KEY = {
    project: 'users.inviteJoinedEvent',
    organization: 'users.inviteJoinedOrganization',
} as const

export interface InviteDialogProps {
    inviteId: string
    /** With the url to open once closed, if any. */
    onClose: (redirectTo?: string) => void
}

export const InviteDialog = ({ inviteId, onClose }: InviteDialogProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const invite = useAppSelector(getInviteSelector)
    const currentUser = useAppSelector(getUserSelector)
    const { t } = useTranslation()

    // Not on navigate: it changes with the pathname (BrowserRouter), the
    // dialog stays open over the redirect, and the first one navigates fine.
    useEffect(() => {
        dispatch(listenForInvite(inviteId, navigate))
        return () => {
            dispatch(unsubscribeRealtimeInviteListener())
        }
    }, [dispatch, inviteId])

    const status = getInviteDialogStatus(invite)
    const destination = getInviteDestination(invite)
    const account =
        getDataFromProviderDataOrUser(currentUser, 'email') ||
        getDataFromProviderDataOrUser(currentUser, 'phoneNumber') ||
        currentUser?.displayName
    const text = {
        loading: '',
        processing: t('users.inviteProcessing'),
        accepted: destination
            ? t(JOINED_KEY[destination.type], { name: destination.name })
            : '',
        failed: t('users.inviteFailed'),
        wrongAccount: t('users.inviteWrongAccount', { account }),
        unavailable: t('users.invitationGetFail'),
    }[status]
    const pending = status === 'loading' || status === 'processing'
    // The organization opens in a modal, which would cover this dialog: it is
    // opened when leaving the dialog, not right on acceptance like an event.
    const organizationUrl =
        status === 'accepted' && destination?.type === 'organization'
            ? getInviteDestinationUrl(destination)
            : undefined
    const close = () => onClose(organizationUrl)

    return (
        <Dialog onClose={close} open={true}>
            <DialogTitle>
                {status === 'accepted'
                    ? t('users.inviteAccepted')
                    : t('users.invitation')}
            </DialogTitle>
            <DialogContent>
                <Box display="flex" alignItems="center" gap={2}>
                    {status === 'accepted' && (
                        <CheckCircleIcon color="success" fontSize="large" />
                    )}
                    <DialogContentText id="alert-dialog-description">
                        {text}
                    </DialogContentText>
                </Box>
                {pending && (
                    <Box margin={2}>
                        <CircularProgress />
                    </Box>
                )}
            </DialogContent>
            {!pending && (
                <DialogActions>
                    <OFButton
                        onClick={close}
                        style={
                            status === 'wrongAccount' ? { design: 'text' } : {}
                        }
                    >
                        {organizationUrl
                            ? t('users.inviteOpenOrganization')
                            : t('common.close')}
                    </OFButton>
                    {status === 'wrongAccount' && (
                        <OFButton onClick={() => dispatch(signOut())}>
                            {t('users.inviteLogout')}
                        </OFButton>
                    )}
                </DialogActions>
            )}
        </Dialog>
    )
}
