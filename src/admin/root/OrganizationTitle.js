import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import COLORS from '../../constants/colors'

const useStyles = makeStyles(() => ({
    title: {
        marginTop: 100,
        marginBottom: 20,
        color: COLORS.WHITE,
    },
}))

export const OrganizationTitle = ({ title }) => {
    const classes = useStyles()

    return (
        <Grid item xs={12}>
            <Typography className={classes.title} variant="h4" gutterBottom>
                {title}
            </Typography>
        </Grid>
    )
}
