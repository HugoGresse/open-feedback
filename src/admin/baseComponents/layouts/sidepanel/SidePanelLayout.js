import React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(theme => ({
    paper: {
        maxWidth: 300,
        padding: 36,
        height: 'auto',
        bottom: 0,
        [theme.breakpoints.down('xs')]: {
            padding: 18,
            width: 'calc(100% - 36px)',
        },
    },
}))

const SidePanelLayout = ({
    title,
    isOpen,
    onClose,
    children,
    containerProps,
}) => {
    const classes = useStyles()

    return (
        <Drawer
            anchor="right"
            classes={{
                paper: classes.paper,
            }}
            open={isOpen}
            onClose={onClose}
            {...containerProps}>
            <Box margin={1}>
                <Box textAlign="right" marginBottom={2}>
                    <IconButton
                        aria-label="Close the side panel"
                        onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="h6">{title}</Typography>
                {children}
            </Box>
        </Drawer>
    )
}

export default SidePanelLayout
