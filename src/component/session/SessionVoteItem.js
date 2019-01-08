import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'

const styles = theme => ({
    itemContainer: {
        margin: -1,
        '&:hover': {
            cursor: 'pointer'
        }
    },
    selectedItem: {
        backgroundColor: '#8ca2ff'
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
        boxSizing: 'border-box'
    }
})

class SessionVoteItem extends Component {
    render() {
        const { classes, voteItem, userVote } = this.props

        const selectedClass = userVote ? classes.selectedItem : ''

        const paperClasses = `${classes.paper} ${selectedClass}`

        return (
            <Grid
                item
                xs={6}
                sm={4}
                md={2}
                className={classes.itemContainer}
                onClick={event => this.props.onClick(event, voteItem)}
            >
                <Paper className={paperClasses}>{voteItem.name}</Paper>
            </Grid>
        )
    }
}

SessionVoteItem.propTypes = {
    classes: PropTypes.object.isRequired,
    voteItem: PropTypes.object.isRequired
}

export default withStyles(styles)(SessionVoteItem)
