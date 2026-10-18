import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import { emphasize, type Theme } from '@mui/material'
import type { ReactNode } from 'react'
import { VoteButtonBackground } from './VoteButtonBackground.tsx'

const useStyles = makeStyles((theme: Theme) => ({
    item: {
        padding: theme.spacing(2),
        textAlign: 'center',
        fontSize: '17px',
        borderRadius: '0',
        color: theme.palette.text.secondary,
        boxShadow: 'inset 0 0 0 1px ' + theme.palette.paperVoteBorder,
        height: '100px',
        width: '100%',
        boxSizing: 'border-box',
        border: 0,
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: emphasize(theme.palette.background.paper, 0.07),
            cursor: 'pointer',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 200ms ease-out',
    },
    selectedItem: {
        boxShadow: 'inset 0 0 0 5px ' + theme.palette.paperVoteBorder,
    },
}))

interface VoteButtonProps {
    isSelected: boolean
    chipColors?: string[]
    onClick: () => void
    count?: number
    children?: ReactNode
    className?: string
}

export const VoteButton = ({
    isSelected,
    chipColors,
    onClick,
    count,
    children,
    className,
}: VoteButtonProps) => {
    const classes = useStyles()
    const paperClasses = `${classes.item} ${
        isSelected ? classes.selectedItem : ''
    } ${className}`
    return (
        <Paper
            elevation={1}
            className={paperClasses}
            onClick={onClick}
            component="button"
        >
            {children}
            <VoteButtonBackground colors={chipColors} count={count} />
        </Paper>
    )
}
