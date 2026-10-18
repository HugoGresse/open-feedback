import type { SyntheticEvent } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { makeStyles } from '@mui/styles'
import { amber, green } from '@mui/material/colors'
import {
    getCurrentNotificationSelector,
    isNotificationOpenSelector,
} from './notificationSelectors'
import {
    processNotificationQueue,
    setOpenNotification,
} from './notifcationActions'
import { useTranslation } from 'react-i18next'
import {
    Snackbar,
    type SnackbarCloseReason,
    SnackbarContent,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import type { Theme } from '@mui/material/styles'
import { useAppDispatch, useAppSelector } from '../../store'

const variantIcon = {
    success: CheckCircleIcon,
    error: ErrorIcon,
}

const useStyles = makeStyles((theme: Theme) => ({
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

export const Notifications = () => {
    const classes = useStyles()
    const notification = useAppSelector(getCurrentNotificationSelector)
    const isOpen = useAppSelector(isNotificationOpenSelector)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    const contentClass = notification ? classes[notification.type] : undefined

    const handleClose = (
        _event: Event | SyntheticEvent,
        reason?: SnackbarCloseReason
    ) => {
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
        if (notification.i18nkey) {
            return (
                t(notification.i18nkey) +
                (notification.message ? notification.message : '')
            )
        }
        if (notification.message) {
            const Icon = variantIcon[notification.type]
            return (
                <span id="client-snackbar" className={classes.message}>
                    {' '}
                    <Icon className={classes.icon} /> {
                        notification.message
                    }{' '}
                </span>
            )
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
            TransitionProps={{
                onExited: handleExited,
            }}
        >
            <SnackbarContent
                className={contentClass}
                aria-describedby="client-snackbar"
                message={getMessage()}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={handleClose}
                        size="large"
                    >
                        <CloseIcon className={classes.closeIcon} />
                    </IconButton>,
                ]}
            />
        </Snackbar>
    )
}
