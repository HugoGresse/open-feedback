import Grid from '@mui/material/Grid'
import type { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { VoteButton } from '../components/VoteButton.tsx'
import type { VoteItem } from '../../../core/models'

const useStyles = makeStyles((theme: Theme) => ({
    itemContainer: {
        margin: -1,
    },
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

interface TalkVoteBooleanProps {
    voteItem: VoteItem
    isSelected: boolean
    /** Number of votes. */
    voteResult?: number
    onVoteChange: (voteItem: VoteItem) => void
    chipColors?: string[]
}

export const TalkVoteBoolean = ({
    voteItem,
    isSelected,
    voteResult,
    onVoteChange,
    chipColors,
}: TalkVoteBooleanProps) => {
    const classes = useStyles()
    const hasVotes = voteResult !== undefined && voteResult > 0

    return (
        <Grid
            item
            xs={6}
            sm={4}
            md={3}
            className={classes.itemContainer}
            aria-label={voteItem.name ?? undefined}
            data-testid="VoteItem"
        >
            <VoteButton
                isSelected={isSelected}
                chipColors={chipColors}
                onClick={() => onVoteChange(voteItem)}
                count={voteResult}
            >
                <span className={classes.voteTitle}>{voteItem.name}</span>
                {hasVotes && (
                    <span className={classes.voteResult}>
                        {voteResult} {voteResult > 1 ? 'votes' : 'vote'}
                    </span>
                )}
            </VoteButton>
        </Grid>
    )
}
