import Grid from '@mui/material/Grid'
import type { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme: Theme) => ({
    separator: {
        borderColor: theme.palette.divider,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}))

export const TalkVoteSeparator = () => {
    const classes = useStyles()

    return (
        <Grid item xs={12} data-testid="VoteItem">
            <hr className={classes.separator} />
        </Grid>
    )
}
