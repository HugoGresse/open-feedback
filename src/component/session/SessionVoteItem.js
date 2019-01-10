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
        border: '4px solid ' + theme.palette.grey[300] + ' !important'
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        fontSize: '17px',
        boxShadow: 'none',
        borderRadius: '0',
        color: theme.palette.text.secondary,
        border: '1px solid ' + theme.palette.grey[300],
        height: '150px',
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor: '#fafafa'
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

class SessionVoteItem extends Component {
    render() {
        const { classes, voteItem, userVote, voteResult } = this.props

        const selectedClass = userVote ? classes.selectedItem : ''

        const paperClasses = `${classes.paper} ${selectedClass}`

        return (
            <Grid
                item
                xs={6}
                sm={4}
                md={3}
                className={classes.itemContainer}
                onClick={event => this.props.onClick(event, voteItem)}
            >
                <Paper elevation={1} className={paperClasses}>
                    {voteItem.name}
                    <br />
                    {voteResult}
                </Paper>
            </Grid>
        )
    }
}

SessionVoteItem.propTypes = {
    classes: PropTypes.object.isRequired,
    voteItem: PropTypes.object.isRequired,
    voteResult: PropTypes.number
}

export default withStyles(styles)(SessionVoteItem)
