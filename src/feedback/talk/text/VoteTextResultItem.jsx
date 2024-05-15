import React from 'react'
import { makeStyles } from '@mui/styles'
import { DateTime } from 'luxon'
import Typography from '@mui/material/Typography'
import { VoteButton } from '../components/VoteButton.jsx'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        marginTop: theme.spacing(2),
    },
    button: {
        width: "80px !important",
        height: "80px !important",
        float: 'left',
        marginRight: theme.spacing(2),
    },
    right: {
        flexDirection: 'row',
        flex: 1,
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
    isSelected,
    chipColors,
    onVoteChange,
    currentUserId,
}) => {
    const classes = useStyles({
        isLast,
    })
    const { t } = useTranslation()
    const isVoteFromUser = vote.userId === currentUserId
    const voteCount = vote.plus === undefined ? 1 : vote.plus // vote.plus can be undefined for old projects

    return (
        <li className={classes.container}>
            <VoteButton
                className={classes.button}
                count={voteCount ?? 1}
                isSelected={isSelected}
                chipColors={chipColors}
                onClick={onVoteChange}
            >
                {voteCount} {voteCount > 1 ? 'votes' : 'vote'}
            </VoteButton>
            <div className={classes.right}>
                <p className={classes.date}>
                    {DateTime.fromJSDate(vote.updatedAt)
                        .minus({ seconds: 1 })
                        .toRelative()}
                    {isVoteFromUser ? ', ' + t('vote.yourVote') : ''}
                </p>
                <Typography className={classes.comment} color="textPrimary">
                    {vote.text}
                </Typography>
            </div>
        </li>
    )
}
