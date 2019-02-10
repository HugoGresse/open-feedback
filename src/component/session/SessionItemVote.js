import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import SessionItemVoteBackground from './SessionItemVoteBackground'

const styles = theme => ({
    itemContainer: {
        margin: -1
    },
    item: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        fontSize: '17px',
        borderRadius: '0',
        color: theme.palette.text.secondary,
        boxShadow: 'inset 0 0 0 1px ' + theme.palette.grey[300],
        height: '150px',
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor: '#f6f6f6',
            cursor: 'pointer'
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 200ms ease-out'
    },
    selectedItem: {
        boxShadow: 'inset 0 0 0 5px ' + theme.palette.grey[300]
    },
    voteTitle: {
        color: theme.palette.grey[800],
        zIndex: 2
    },
    voteResult: {
        position: 'absolute',
        bottom: '5px',
        fontSize: '14px',
        transition: 'all 200ms ease-in-out',
        zIndex: 2
    },
    backgroundCanvas: {
        width: '100%'
    }
})

class SessionItemVote extends Component {
    render() {
        const {
            classes,
            voteItem,
            userVote,
            voteResult,
            chipColors
        } = this.props

        const paperClasses = `${classes.item} ${
            userVote ? classes.selectedItem : ''
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
                        <>
                            <span className={classes.voteResult}>
                                {voteResult}{' '}
                                <span>{voteResult > 1 ? 'votes' : 'vote'}</span>
                            </span>
                            <SessionItemVoteBackground
                                colors={chipColors}
                                count={voteResult}
                            />
                        </>
                    )}
                </Paper>
            </Grid>
        )
    }
}

SessionItemVote.propTypes = {
    classes: PropTypes.object.isRequired,
    voteItem: PropTypes.object.isRequired,
    voteResult: PropTypes.number,
    chipColors: PropTypes.array
}

export default withStyles(styles)(SessionItemVote)
