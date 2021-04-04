import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

const TalkVoteTextResult = ({ result }) => {
    return (
        <div className="comments">
            {result.map((item, key) => (
                <VoteText
                    key={key}
                    vote={item}
                    isLast={key === result.length - 1}
                />
            ))}
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
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

const VoteText = ({ vote, isLast }) => {
    const classes = useStyles({
        isLast,
    })

    return (
        <div>
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

TalkVoteTextResult.propTypes = {
    result: PropTypes.array.isRequired,
}

export default TalkVoteTextResult
