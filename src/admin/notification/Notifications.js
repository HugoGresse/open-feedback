import React, { Component } from 'react'
import { connect } from 'react-redux'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import withStyles from '@material-ui/core/styles/withStyles'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import { getLastNotificationsSelector } from './notificationSelectors'
import Snackbar from '@material-ui/core/Snackbar'
import { clearNotification } from './notifcationActions'

const variantIcon = {
    success: CheckCircleIcon,
    error: ErrorIcon
}

const styles = theme => ({
    success: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    info: {
        backgroundColor: theme.palette.primary.dark
    },
    warning: {
        backgroundColor: amber[700]
    },
    icon: {
        fontSize: 20,

        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    }
})

class Notifications extends Component {
    onNotificationClose(notification) {
        this.props.clearNotification(notification)
    }

    render() {
        const { classes, onClose, notification } = this.props
        if (!notification) {
            return ''
        }
        const Icon = variantIcon[notification.type]
        const contentClass = classes[notification.type]

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={!!notification}
                autoHideDuration={6000}
                onClose={() => this.onNotificationClose(notification)}
            >
                <SnackbarContent
                    className={contentClass}
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.message}>
                            {' '}
                            <Icon className={classes.icon} />{' '}
                            {notification.message}{' '}
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={onClose}
                        >
                            <CloseIcon className={classes.icon} />
                        </IconButton>
                    ]}
                />
            </Snackbar>
        )
    }
}

const mapStateToProps = state => ({
    notification: getLastNotificationsSelector(state)
})

const mapDispatchToProps = Object.assign(
    {},
    {
        clearNotification: clearNotification
    }
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Notifications))
