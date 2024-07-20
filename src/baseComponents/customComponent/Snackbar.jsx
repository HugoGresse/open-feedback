import React from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SnackbarMaterial from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
    close: {
        padding: theme.spacing(1) / 2,
    },
}))

export const Snackbar = ({
                             text,
                             actionText,
                             actionCallback,
                             closeCallback,
                         }) => {
    const classes = useStyles()

    return (
        <SnackbarMaterial
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={true}
            autoHideDuration={6000}
            onClose={closeCallback}
            ContentProps={{
                'aria-describedby': 'message-id',
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
                        sx={{ padding: 1 }}
                        className={classes ? classes.close : null}
                        onClick={closeCallback}
                        size="large">
                        <CloseIcon />
                    </IconButton>,
                ]
            }
        />
    )
}
