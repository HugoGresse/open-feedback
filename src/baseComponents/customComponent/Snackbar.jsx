import React, { Component } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SnackbarMaterial from '@mui/material/Snackbar'

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
                            sx={{ padding: 1}}
                            className={classes.close}
                            onClick={closeCallback}
                            size="large">
                            <CloseIcon />
                        </IconButton>
                    ]
                }
            />
        );
    }
}

export default Snackbar
