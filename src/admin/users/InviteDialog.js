import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { useDispatch, useSelector } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Box } from '@material-ui/core'
import { isEmpty } from 'lodash'
import { getInviteSelector, getUsersSelector } from './core/usersSelectors'
import { useTranslation } from 'react-i18next'
import {
    listenForInvite,
    unsubscribeRealtimeInviteListener,
} from './core/actions/inviteListener'

const InviteDialog = ({ inviteId }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const invite = useSelector(getInviteSelector)
    const currentUser = useSelector(getUsersSelector)
    const { t } = useTranslation()

    useEffect(() => {
        dispatch(listenForInvite(inviteId, history))
        return () => {
            dispatch(unsubscribeRealtimeInviteListener())
        }
    }, [dispatch, inviteId, history])

    const closeDialog = () => {
        history.push(history.location.pathname)
    }

    let text = ''
    if (invite) {
        if (
            invite.destinationUserInfo !== currentUser.email &&
            invite.destinationUserInfo !== currentUser.phoneNumber
        ) {
            history.push(history.location.pathname)
        }
        if (invite.status === 'emailSent') {
            text = t("You'll be redirected to the event or organization soon")
        }
    } else {
        text = t("You've already used this invitation")
    }

    return (
        <Dialog
            onClose={() => closeDialog()}
            aria-labelledby="event invitation"
            open={!isEmpty(inviteId)}>
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
export default InviteDialog
