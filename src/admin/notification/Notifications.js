import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import { getLastNotificationsSelector } from './notificationSelectors'
import Snackbar from '@material-ui/core/Snackbar'
import { clearNotification } from './notifcationActions'
import makeStyles from '@material-ui/core/styles/makeStyles'

const variantIcon = {
    success: CheckCircleIcon,
    error: ErrorIcon,
}

const useStyles = makeStyles(theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,

        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}))

const Notifications = () => {
    const classes = useStyles()
    const notification = useSelector(getLastNotificationsSelector)
    const dispatch = useDispatch()

    if (!notification) {
        return ''
    }
    const Icon = variantIcon[notification.type]
    const contentClass = classes[notification.type]

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={!!notification}
            autoHideDuration={4000}
            onClose={() => dispatch(clearNotification(notification))}>
            <SnackbarContent
                className={contentClass}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                        {' '}
                        <Icon className={classes.icon} /> {notification.message}{' '}
                    </span>
                }
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.close}
                        onClick={() =>
                            dispatch(clearNotification(notification))
                        }>
                        <CloseIcon className={classes.icon} />
                    </IconButton>,
                ]}
            />
        </Snackbar>
    )
}

export default Notifications
