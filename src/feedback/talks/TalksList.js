import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedTalk } from '../talk/core/talkActions'
import TalksItem from './TalksItem'
import Grid from '@material-ui/core/Grid'
import { getVotesByTalkSelector } from '../vote/voteSelectors'
import Title from '../../baseComponents/design/Title'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(() => ({
    track: {
        marginTop: 40,
        marginBottom: 30,
    },
}))

const TalksList = ({ talks }) => {
    const dispatch = useDispatch()
    const classes = useStyles()

    const userTalkVote = useSelector(getVotesByTalkSelector)

    return talks.map((track, key) => (
        <div key={key}>
            <Title color="textPrimary" component="h3" className={classes.track}>
                {track.track}
            </Title>

            <Grid container spacing={2}>
                {track.talks.map((talk, key) => (
                    <TalksItem
                        key={key}
                        talk={talk}
                        userVote={userTalkVote[talk.id]}
                        onClick={talk => dispatch(setSelectedTalk(talk.id))}
                    />
                ))}
            </Grid>
        </div>
    ))
}

export default TalksList
