import Grid from '@mui/material/Grid'
import { BooleanVoteButton } from './BooleanVoteButton.tsx'
import type { VoteItem } from '../../../core/models'

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
    return (
        <Grid
            item
            xs={6}
            sm={4}
            md={3}
            sx={{ margin: '-1px' }}
            aria-label={voteItem.name ?? undefined}
            data-testid="VoteItem"
        >
            <BooleanVoteButton
                name={voteItem.name}
                isSelected={isSelected}
                chipColors={chipColors}
                onClick={() => onVoteChange(voteItem)}
                voteResult={voteResult}
            />
        </Grid>
    )
}
