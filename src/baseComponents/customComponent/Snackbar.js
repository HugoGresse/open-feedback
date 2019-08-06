import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import SnackbarMaterial from '@material-ui/core/Snackbar'
import PropTypes from 'prop-types'

const styles = theme => ({
    close: {
        padding: theme.spacing(1) / 2
    }
})

class Snackbar extends Component {
    render() {
        const {
            text,
            actionText,
            actionCallback,
            closeCallback,
            classes
        } = this.props
        return (
            <SnackbarMaterial
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={true}
                autoHideDuration={6000}
                onClose={closeCallback}
                ContentProps={{
                    'aria-describedby': 'message-id'
                }}
                message={<span id="message-id">{text}</span>}
                action={
                    actionText && [
                        <Button
                            key="undo"
                            color="secondary"
                            size="small"
                            onClick={actionCallback}
                        >
                            {actionText}
                        </Button>,
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={closeCallback}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]
                }
            />
        )
    }
}

Snackbar.propTypes = {
    classes: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    actionText: PropTypes.string,
    actionCallback: PropTypes.func,
    closeCallback: PropTypes.func
}

export default withStyles(styles)(Snackbar)
