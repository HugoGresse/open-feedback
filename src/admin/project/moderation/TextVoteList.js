import React from 'react'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import TextVoteItem from './TextVoteItem'

const useStyles = makeStyles(() => ({
    container: {
        background: '#DDD',
        borderRadius: 10,
        padding: '13px 16px',
        wordBreak: 'break-word',
    },
    content: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
}))

const TextVoteList = ({ textVotes, onVoteHideClick }) => {
    const classes = useStyles()

    return (
        <Grid container spacing={2}>
            {textVotes &&
                textVotes.map(vote => (
                    <Grid item key={vote.firestoreId} xs={12} sm={6} md={4}>
                        <div className={classes.container}>
                            <TextVoteItem
                                vote={vote}
                                onVoteHideClick={onVoteHideClick}
                            />
                        </div>
                    </Grid>
                ))}
        </Grid>
    )
}

export default TextVoteList
