import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    paper: {
        maxWidth: 300,
        minWidth: 300,
        padding: 36,
        height: 'auto',
        bottom: 0,
        [theme.breakpoints.down('lg')]: {
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
                    <IconButton aria-label="Close the side panel" onClick={onClose} size="large">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="h6">{title}</Typography>
                {children}
            </Box>
        </Drawer>
    );
}

export default SidePanelLayout
