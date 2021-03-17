import React from 'react'
import Grid from '@material-ui/core/Grid'

import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import TalkVoteBackground from './TalkVoteBackground'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { emphasize } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    itemContainer: {
        margin: -1,
    },
    item: {
        padding: theme.spacing(2),
        textAlign: 'center',
        fontSize: '17px',
        borderRadius: '0',
        color: theme.palette.text.secondary,
        boxShadow: 'inset 0 0 0 1px ' + theme.palette.paperVoteBorder,
        height: '100px',
        width: '100%',
        boxSizing: 'border-box',
        border: 0,
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: emphasize(theme.palette.background.paper, 0.07),
            cursor: 'pointer',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 200ms ease-out',
    },
    selectedItem: {
        boxShadow: 'inset 0 0 0 5px ' + theme.palette.paperVoteBorder,
    },
    voteTitle: {
        color: theme.palette.textVoteTitle,
        zIndex: 2,
        textShadow: `0px 0px 6px ${theme.palette.textVoteTitleShadow}`,
    },
    voteResult: {
        position: 'absolute',
        bottom: '5px',
        fontSize: '14px',
        transition: 'all 200ms ease-in-out',
        zIndex: 2,
        textShadow: `0px 0px 6px ${theme.palette.textVoteTitleShadow}`,
    },
    backgroundCanvas: {
        width: '100%',
    },
}))

const TalkVoteBoolean = ({
    voteItem,
    isSelected,
    voteResult,
    onVoteChange,
    chipColors,
}) => {
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
            aria-label={voteItem.name}
            data-testid="VoteItem">
            <Paper
                elevation={1}
                className={paperClasses}
                onClick={() => onVoteChange(voteItem)}
                component="button">
                <span className={classes.voteTitle}>{voteItem.name}</span>
                {voteResult > 0 && (
                    <>
                        <span className={classes.voteResult}>
                            {voteResult} {voteResult > 1 ? 'votes' : 'vote'}
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
