import type { ReactNode } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Drawer, { type DrawerProps } from '@mui/material/Drawer'
import { makeStyles } from '@mui/styles'
import type { Theme } from '@mui/material/styles'

const useStyles = makeStyles((theme: Theme) => ({
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

export interface SidePanelLayoutProps {
    title?: ReactNode
    isOpen: boolean
    onClose: () => void
    children?: ReactNode
    // Extra props spread on the Drawer
    containerProps?: Partial<DrawerProps>
}

export const SidePanelLayout = ({
    title,
    isOpen,
    onClose,
    children,
    containerProps,
}: SidePanelLayoutProps) => {
    const classes = useStyles()

    return (
        <Drawer
            anchor="right"
            classes={{
                paper: classes.paper,
            }}
            open={isOpen}
            onClose={onClose}
            {...containerProps}
        >
            <Box margin={1}>
                <Box textAlign="right" marginBottom={2}>
                    <IconButton
                        aria-label="Close the side panel"
                        onClick={onClose}
                        size="large"
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="h6">{title}</Typography>
                {children}
            </Box>
        </Drawer>
    )
}
