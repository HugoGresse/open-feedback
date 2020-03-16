import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import {
    getCurrentNotificationSelector,
    isNotificationOpenSelector,
} from './notificationSelectors'
import Snackbar from '@material-ui/core/Snackbar'
import {
    processNotificationQueue,
    setOpenNotification,
} from './notifcationActions'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { useTranslation } from 'react-i18next'

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
    closeIcon: {
        fontSize: 20,
        opacity: 0.9,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}))

const Notifications = () => {
    const classes = useStyles()
    const notification = useSelector(getCurrentNotificationSelector)
    const isOpen = useSelector(isNotificationOpenSelector)
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const Icon = notification ? variantIcon[notification.type] : undefined
    const contentClass = notification ? classes[notification.type] : undefined

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(setOpenNotification(false))
    }

    const handleExited = () => {
        dispatch(processNotificationQueue())
    }

    const getMessage = () => {
        if (!notification) {
            return undefined
        }
        if (notification.message) {
            return (
                <span id="client-snackbar" className={classes.message}>
                    {' '}
                    <Icon className={classes.icon} /> {notification.message}{' '}
                </span>
            )
        }
        if (notification.i18nkey) {
            return t(notification.i18nkey)
        }
    }

    return (
        <Snackbar
            key={notification ? notification.key : undefined}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={isOpen}
            autoHideDuration={4000}
            onClose={handleClose}
            onExited={handleExited}>
            <SnackbarContent
                className={contentClass}
                aria-describedby="client-snackbar"
                message={getMessage()}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={handleClose}>
                        <CloseIcon className={classes.closeIcon} />
                    </IconButton>,
                ]}
            />
        </Snackbar>
    )
}

export default Notifications
