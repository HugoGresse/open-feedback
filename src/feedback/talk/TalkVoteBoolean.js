import React from 'react'
import Grid from '@material-ui/core/Grid'

import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import TalkVoteBackground from './TalkVoteBackground'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(theme => ({
    itemContainer: {
        margin: -1,
    },
    item: {
        padding: theme.spacing(2),
        textAlign: 'center',
        fontSize: '17px',
        borderRadius: '0',
        color: theme.palette.text.secondary,
        boxShadow: 'inset 0 0 0 1px ' + theme.palette.grey[300],
        height: '100px',
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor: '#f6f6f6',
            cursor: 'pointer',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 200ms ease-out',
    },
    selectedItem: {
        boxShadow: 'inset 0 0 0 5px ' + theme.palette.grey[300],
    },
    voteTitle: {
        color: '#222',
        zIndex: 2,
        textShadow: '0px 0px 6px #fff',
    },
    voteResult: {
        position: 'absolute',
        bottom: '5px',
        fontSize: '14px',
        transition: 'all 200ms ease-in-out',
        zIndex: 2,
        textShadow: '0px 0px 6px #fff',
    },
    backgroundCanvas: {
        width: '100%',
    },
}))

const TalkVoteBoolean = ({ voteItem, isSelected, voteResult, chipColors }) => {
    const classes = useStyles()
    const paperClasses = `${classes.item} ${
        isSelected ? classes.selectedItem : ''
    }`

    return (
        <Grid
            item
            xs={6}
            sm={4}
            md={3}
            className={classes.itemContainer}
            onClick={() => this.props.onVoteChange(voteItem)}>
            <Paper elevation={1} className={paperClasses}>
                <span className={classes.voteTitle}>{voteItem.name}</span>
                {voteResult > 0 && (
                    <>
                        <span className={classes.voteResult}>
                            {voteResult}{' '}
                            <span>{voteResult > 1 ? 'votes' : 'vote'}</span>
                        </span>
                        <TalkVoteBackground
                            colors={chipColors}
                            count={voteResult}
                        />
                    </>
                )}
            </Paper>
        </Grid>
    )
}

TalkVoteBoolean.propTypes = {
    voteItem: PropTypes.object.isRequired,
    isSelected: PropTypes.bool,
    voteResult: PropTypes.number,
    chipColors: PropTypes.array,
}

export default TalkVoteBoolean
