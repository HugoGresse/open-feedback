import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

export const TalkVoteTitle = ({
                                 voteItem
                             }) => {

    return (
        <Grid
            item
            xs={12}
            data-testid="VoteItem"
        >
            <Typography variant="h4" color="textPrimary" component="h3">
                {voteItem.name}
            </Typography>
        </Grid>
    )
}
