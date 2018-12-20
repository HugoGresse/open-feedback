import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import React from "react"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"

const styles = theme => ({
    itemContainer: {
        margin: -1
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        boxShadow: 'none',
        borderRadius: '0',
        borderColor: '#e2e2e2',
        border: '1px solid',
        height: '100%',
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor: '#fafafa'
        }
    }
})


export const SessionItem = props => {
    const {classes, session} = props

    return (
        <Grid item xs={6} sm={4} md={2} className={classes.itemContainer}>
            <Paper className={classes.paper}>{session.title}</Paper>
        </Grid>
    )
}


SessionItem.propTypes = {
    classes: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
}

export default withStyles(styles)(SessionItem)
