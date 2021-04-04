import React from 'react'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { VoteButton } from '../components/VoteButton'

const useStyles = makeStyles((theme) => ({
    itemContainer: {
        margin: -1,
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
}))

const TalkVoteBoolean = ({
    voteItem,
    isSelected,
    voteResult,
    onVoteChange,
    chipColors,
}) => {
    const classes = useStyles()

    return (
        <Grid
            item
            xs={6}
            sm={4}
            md={3}
            className={classes.itemContainer}
            aria-label={voteItem.name}
            data-testid="VoteItem">
            <VoteButton
                isSelected={isSelected}
                chipColors={chipColors}
                onClick={() => onVoteChange(voteItem)}
                count={voteResult}
                displayChildren={voteResult > 0}>
                <span className={classes.voteTitle}>{voteItem.name}</span>
                {voteResult > 0 && (
                    <span className={classes.voteResult}>
                        {voteResult} {voteResult > 1 ? 'votes' : 'vote'}
                    </span>
                )}
            </VoteButton>
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
