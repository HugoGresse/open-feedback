import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import type { VoteItem } from '../../../core/models'

interface TalkVoteTitleProps {
    voteItem: VoteItem
}

export const TalkVoteTitle = ({ voteItem }: TalkVoteTitleProps) => {
    return (
        <Grid item xs={12} data-testid="VoteItem">
            <Typography variant="h4" color="textPrimary" component="h3">
                {voteItem.name}
            </Typography>
        </Grid>
    )
}
