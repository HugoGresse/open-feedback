import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { DateTime } from 'luxon'
import Typography from '@material-ui/core/Typography'
import { VoteButton } from '../components/VoteButton'

const useStyles = makeStyles((theme) => ({
    button: {
        width: 100,
        float: 'left',
        marginRight: 18,
    },
    date: {
        color: theme.palette.textDimmed,
        fontSize: 14,
        marginBottom: 0,
    },
    comment: {
        borderBottom: (props) =>
            props.isLast ? '' : `1px solid ${theme.palette.paperBorder}`,
        paddingBottom: 15,
        marginTop: 10,
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
}))

export const VoteTextResultItem = ({
    vote,
    isLast,
    chipColors,
    onVoteChange,
}) => {
    const classes = useStyles({
        isLast,
    })

    return (
        <div>
            <VoteButton
                className={classes.button}
                count={1}
                isSelected={false}
                chipColors={chipColors}
                onClick={onVoteChange}>
                {vote.plus} {vote.plus > 1 ? 'votes' : 'vote'}
            </VoteButton>
            <p className={classes.date}>
                {DateTime.fromJSDate(vote.updatedAt)
                    .minus({ seconds: 1 })
                    .toRelative()}
            </p>
            <Typography className={classes.comment} color="textPrimary">
                {vote.text}
            </Typography>
        </div>
    )
}
