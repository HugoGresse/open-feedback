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
    item: {
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
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 200ms ease-out'
    },
    selectedItem: {
        border: '4px solid ' + theme.palette.grey[300] + ' !important'
    },
    voteTitle: {
        color: theme.palette.grey[800]
    },
    voteResult: {
        position: 'absolute',
        bottom: '5px',
        fontSize: '14px',
        transition: 'all 200ms ease-in-out'
    },

    voteResultSelected: {
        bottom: '2px'
    }
})

class SessionVoteItem extends Component {
    render() {
        const { classes, voteItem, userVote, voteResult } = this.props

        const paperClasses = `${classes.item} ${
            userVote ? classes.selectedItem : ''
        }`
        const voteResultClasses = `${classes.voteResult} ${
            userVote ? classes.voteResultSelected : ''
        }`

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
                    <span className={classes.voteTitle}>{voteItem.name}</span>
                    {voteResult > 0 && (
                        <span className={voteResultClasses}>
                            {voteResult}{' '}
                            <span>{voteResult > 1 ? 'votes' : 'vote'}</span>
                        </span>
                    )}
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
