import React from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedTalk } from '../talk/core/talkActions'
import TalksItem from './TalksItem'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(() => ({
    track: {
        marginTop: 40,
        marginBottom: 30,
    },
}))

const TalksList = ({ talks, userTalkVote }) => {
    const dispatch = useDispatch()
    const classes = useStyles()

    return talks.map((track, key) => (
        <div key={key}>
            <Typography
                color="textPrimary"
                component="h2"
                variant="h3"
                className={classes.track}>
                {track.track}
            </Typography>

            <Grid container spacing={2}>
                {track.talks.map((talk, key) => (
                    <TalksItem
                        key={key}
                        talk={talk}
                        userVote={userTalkVote[talk.id]}
                        onClick={(talk) => dispatch(setSelectedTalk(talk.id))}
                    />
                ))}
            </Grid>
        </div>
    ))
}

export default TalksList
