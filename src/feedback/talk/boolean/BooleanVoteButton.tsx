import type { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { VoteButton } from '../components/VoteButton.tsx'

const useStyles = makeStyles((theme: Theme) => ({
    voteTitle: {
        color: theme.palette.textVoteTitle,
        zIndex: 2,
        textShadow: `0px 0px 6px ${theme.palette.textVoteTitleShadow}`,
    },
    voteResult: {
        position: 'absolute',
        bottom: '5px',
        fontSize: '14px',
        transition: 'all 200ms ease-in-out',
        zIndex: 2,
        textShadow: `0px 0px 6px ${theme.palette.textVoteTitleShadow}`,
    },
}))

interface BooleanVoteButtonProps {
    name: string | null
    isSelected: boolean
    /** Number of votes. */
    voteResult?: number
    onClick: () => void
    /** Hex colors without `#`, the project chip colors. */
    chipColors?: string[]
}

/** A boolean vote as attendees see it, without the grid layout. */
export const BooleanVoteButton = ({
    name,
    isSelected,
    voteResult,
    onClick,
    chipColors,
}: BooleanVoteButtonProps) => {
    const classes = useStyles()
    const hasVotes = voteResult !== undefined && voteResult > 0

    return (
        <VoteButton
            isSelected={isSelected}
            chipColors={chipColors}
            onClick={onClick}
            count={voteResult}
        >
            <span className={classes.voteTitle}>{name}</span>
            {hasVotes && (
                <span className={classes.voteResult}>
                    {voteResult} {voteResult > 1 ? 'votes' : 'vote'}
                </span>
            )}
        </VoteButton>
    )
}
