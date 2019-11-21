import React, {useEffect} from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import {useDispatch, useSelector} from 'react-redux'
import {
    acceptInvite,
    discardedInvite,
    listenForInvite,
    unsubscribeRealtimeInviteListener
} from '../project/settings/users/usersActions'
import CircularProgress from '@material-ui/core/CircularProgress'
import {Box} from '@material-ui/core'
import {isEmpty} from 'lodash'
import {getInviteSelector} from '../project/settings/users/usersSelectors'
import {history} from '../../App'

const ProjectInviteDialog = ({inviteId}) => {
    const dispatch = useDispatch()
    const invite = useSelector(getInviteSelector)

    useEffect(() => {
        dispatch(listenForInvite(inviteId))
        return () => {
            dispatch(unsubscribeRealtimeInviteListener())
        }
    }, [dispatch, inviteId])

    useEffect(() => {
        dispatch(acceptInvite(inviteId))
    }, [dispatch, inviteId])

    const closeDialog = () => {
        const redirectUrl = history.location.pathname
        dispatch(discardedInvite(inviteId))
        history.push(redirectUrl)
    }

    let text = ""
    if(invite && (invite.status === 'emailSent' || invite.status === 'userAccepted')) {
        text = "You'll be redirected to the event soon"
    } else {
        text = "You've already used this invitation"
    }

    return  <Dialog onClose={() => closeDialog()} aria-labelledby="event invitation" open={!isEmpty(inviteId)}>
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


}
export default ProjectInviteDialog
