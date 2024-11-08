import React from 'react'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    separator: {
        height: 1,
        backgroundColor: theme.palette.divider,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}))

export const TalkVoteSeparator = () => {
    const classes = useStyles()

    return (
        <Grid
            item
            xs={12}
            data-testid="VoteItem"
        >
            <div className={classes.separator} />
        </Grid>
    )
}
